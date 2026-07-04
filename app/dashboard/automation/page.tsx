"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap, Copy, Play, Check, Terminal, RefreshCw, Shield,
  HardDrive, Wifi, Users, Printer, Key, Download, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

const AUTOMATION_SCRIPTS = [
  {
    category: "Active Directory",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    scripts: [
      {
        name: "Reset User Password",
        desc: "Reset an AD user password and force change at next login",
        params: [{ key: "username", label: "Username", placeholder: "john.smith" }],
        generate: (p: Record<string, string>) => `# Reset AD User Password
$Username = "${p.username || "john.smith"}"
$NewPassword = ConvertTo-SecureString "TempPass@123!" -AsPlainText -Force

Set-ADAccountPassword -Identity $Username -NewPassword $NewPassword -Reset
Set-ADUser -Identity $Username -ChangePasswordAtLogon $true
Unlock-ADAccount -Identity $Username

Write-Host "✅ Password reset for $Username" -ForegroundColor Green
Write-Host "📋 Temp password: TempPass@123!" -ForegroundColor Yellow`,
      },
      {
        name: "Unlock AD Account",
        desc: "Unlock a locked-out Active Directory account",
        params: [{ key: "username", label: "Username", placeholder: "john.smith" }],
        generate: (p: Record<string, string>) => `# Unlock AD Account
$Username = "${p.username || "john.smith"}"

$User = Get-ADUser -Identity $Username -Properties LockedOut, BadLogonCount
Write-Host "User: $($User.Name)" -ForegroundColor Cyan
Write-Host "Locked: $($User.LockedOut)" -ForegroundColor Yellow
Write-Host "Bad Logons: $($User.BadLogonCount)" -ForegroundColor Yellow

Unlock-ADAccount -Identity $Username
Write-Host "✅ Account unlocked successfully" -ForegroundColor Green`,
      },
      {
        name: "Create New User",
        desc: "Create a new AD user with standard settings",
        params: [
          { key: "firstname", label: "First Name", placeholder: "John" },
          { key: "lastname", label: "Last Name", placeholder: "Smith" },
          { key: "department", label: "Department", placeholder: "Finance" },
        ],
        generate: (p: Record<string, string>) => `# Create New AD User
$FirstName = "${p.firstname || "John"}"
$LastName = "${p.lastname || "Smith"}"
$Department = "${p.department || "Finance"}"
$Username = "$($FirstName.ToLower()).$($LastName.ToLower())"
$Password = ConvertTo-SecureString "Welcome@2024!" -AsPlainText -Force

New-ADUser \`
  -Name "$FirstName $LastName" \`
  -GivenName $FirstName \`
  -Surname $LastName \`
  -SamAccountName $Username \`
  -UserPrincipalName "$Username@company.com" \`
  -Department $Department \`
  -AccountPassword $Password \`
  -ChangePasswordAtLogon $true \`
  -Enabled $true

Add-ADGroupMember -Identity "Domain Users" -Members $Username
Write-Host "✅ User $Username created successfully" -ForegroundColor Green`,
      },
    ],
  },
  {
    category: "Windows Health",
    icon: HardDrive,
    color: "from-blue-500 to-blue-600",
    scripts: [
      {
        name: "System Health Check",
        desc: "Full system diagnostic: CPU, RAM, Disk, Services",
        params: [],
        generate: () => `# Windows System Health Check
Write-Host "========== SYSTEM HEALTH REPORT ==========" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date)" -ForegroundColor Gray

# CPU Usage
$CPU = (Get-WmiObject Win32_Processor | Measure-Object LoadPercentage -Average).Average
Write-Host "\n🖥️  CPU Usage: $CPU%" -ForegroundColor $(if($CPU -gt 80){"Red"}else{"Green"})

# RAM Usage
$OS = Get-WmiObject Win32_OperatingSystem
$RAMUsed = [math]::Round(($OS.TotalVisibleMemorySize - $OS.FreePhysicalMemory)/1MB, 2)
$RAMTotal = [math]::Round($OS.TotalVisibleMemorySize/1MB, 2)
$RAMPct = [math]::Round(($RAMUsed/$RAMTotal)*100)
Write-Host "💾 RAM: $RAMUsed GB / $RAMTotal GB ($RAMPct%)" -ForegroundColor $(if($RAMPct -gt 85){"Red"}else{"Green"})

# Disk Space
Get-PSDrive -PSProvider FileSystem | ForEach-Object {
  $Used = [math]::Round($_.Used/1GB, 2)
  $Free = [math]::Round($_.Free/1GB, 2)
  $Total = $Used + $Free
  if ($Total -gt 0) {
    $Pct = [math]::Round(($Used/$Total)*100)
    Write-Host "💿 Drive $($_.Name): $Used GB used / $Total GB ($Pct% full)" -ForegroundColor $(if($Pct -gt 85){"Red"}elseif($Pct -gt 70){"Yellow"}else{"Green"})
  }
}

# Critical Services
$Services = @("wuauserv","bits","wscsvc","MpsSvc","Winmgmt")
Write-Host "\n🔧 Critical Services:" -ForegroundColor Cyan
$Services | ForEach-Object {
  $Svc = Get-Service -Name $_ -ErrorAction SilentlyContinue
  $Status = if ($Svc) { $Svc.Status } else { "Not Found" }
  Write-Host "  $_ : $Status" -ForegroundColor $(if($Status -eq "Running"){"Green"}else{"Red"})
}

Write-Host "\n=========================================" -ForegroundColor Cyan`,
      },
      {
        name: "Clear Temp Files & Free Space",
        desc: "Clean temp files, prefetch, and recycle bin",
        params: [],
        generate: () => `# Clean Temp Files
Write-Host "🧹 Starting cleanup..." -ForegroundColor Cyan

$Before = (Get-PSDrive C).Free/1GB
$Paths = @(
  "$env:TEMP",
  "$env:SystemRoot\\Temp",
  "$env:SystemRoot\\Prefetch",
  "$env:SystemRoot\\SoftwareDistribution\\Download"
)

$Cleaned = 0
foreach ($Path in $Paths) {
  if (Test-Path $Path) {
    $Size = (Get-ChildItem $Path -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    Remove-Item "$Path\\*" -Recurse -Force -ErrorAction SilentlyContinue
    $Cleaned += $Size
    Write-Host "  ✅ Cleaned: $Path" -ForegroundColor Green
  }
}

# Empty Recycle Bin
Clear-RecycleBin -Force -ErrorAction SilentlyContinue
Write-Host "  ✅ Recycle Bin emptied" -ForegroundColor Green

$After = (Get-PSDrive C).Free/1GB
$Freed = [math]::Round($After - $Before, 2)
Write-Host "\n✅ Total freed: $Freed GB" -ForegroundColor Green`,
      },
      {
        name: "Flush DNS & Reset Network",
        desc: "Fix network issues by flushing DNS and resetting TCP/IP stack",
        params: [],
        generate: () => `# Flush DNS and Reset Network Stack
Write-Host "🌐 Resetting network..." -ForegroundColor Cyan

# Flush DNS
ipconfig /flushdns
Write-Host "✅ DNS cache flushed" -ForegroundColor Green

# Reset Winsock
netsh winsock reset
Write-Host "✅ Winsock reset" -ForegroundColor Green

# Reset TCP/IP
netsh int ip reset resetlog.txt
Write-Host "✅ TCP/IP stack reset" -ForegroundColor Green

# Release and renew IP
ipconfig /release
Start-Sleep -Seconds 2
ipconfig /renew
Write-Host "✅ IP address renewed" -ForegroundColor Green

# Register DNS
ipconfig /registerdns
Write-Host "✅ DNS registered" -ForegroundColor Green

Write-Host "\n⚠️  Restart required to complete network reset" -ForegroundColor Yellow`,
      },
    ],
  },
  {
    category: "Security",
    icon: Shield,
    color: "from-red-500 to-red-600",
    scripts: [
      {
        name: "Security Audit",
        desc: "Check firewall, antivirus, last logins, and open ports",
        params: [],
        generate: () => `# Security Audit Script
Write-Host "🔐 SECURITY AUDIT REPORT" -ForegroundColor Red
Write-Host "Date: $(Get-Date)" -ForegroundColor Gray

# Firewall Status
$FW = Get-NetFirewallProfile
Write-Host "\n🛡️  Windows Firewall:" -ForegroundColor Cyan
$FW | ForEach-Object { Write-Host "  $($_.Name): $($_.Enabled)" -ForegroundColor $(if($_.Enabled){"Green"}else{"Red"}) }

# Windows Defender
$Defender = Get-MpComputerStatus
Write-Host "\n🦠 Windows Defender:" -ForegroundColor Cyan
Write-Host "  Real-time Protection: $($Defender.RealTimeProtectionEnabled)" -ForegroundColor $(if($Defender.RealTimeProtectionEnabled){"Green"}else{"Red"})
Write-Host "  Definitions Updated: $($Defender.AntivirusSignatureLastUpdated)" -ForegroundColor Gray

# Last 10 failed logons
Write-Host "\n❌ Recent Failed Logons:" -ForegroundColor Cyan
Get-EventLog -LogName Security -InstanceId 4625 -Newest 5 -ErrorAction SilentlyContinue |
  Select-Object TimeGenerated, Message |
  ForEach-Object { Write-Host "  $($_.TimeGenerated): Failed logon attempt" -ForegroundColor Yellow }

# Open Ports
Write-Host "\n🔌 Listening Ports:" -ForegroundColor Cyan
Get-NetTCPConnection -State Listen |
  Select-Object LocalPort, OwningProcess |
  Sort-Object LocalPort |
  ForEach-Object {
    $Proc = (Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name
    Write-Host "  Port $($_.LocalPort): $Proc" -ForegroundColor Gray
  }`,
      },
      {
        name: "Force Windows Update",
        desc: "Check and install pending Windows updates",
        params: [],
        generate: () => `# Force Windows Update
Write-Host "🔄 Checking Windows Updates..." -ForegroundColor Cyan

# Install PSWindowsUpdate module if needed
if (-not (Get-Module -ListAvailable PSWindowsUpdate)) {
  Install-Module PSWindowsUpdate -Force -Confirm:$false
}
Import-Module PSWindowsUpdate

# Get pending updates
$Updates = Get-WindowsUpdate -AcceptAll -IgnoreReboot
Write-Host "Found $($Updates.Count) updates" -ForegroundColor Yellow

# Install updates
if ($Updates.Count -gt 0) {
  Install-WindowsUpdate -AcceptAll -IgnoreReboot -AutoReboot:$false
  Write-Host "✅ Updates installed. Reboot may be required." -ForegroundColor Green
} else {
  Write-Host "✅ System is up to date!" -ForegroundColor Green
}

# Check if reboot required
$RebootPending = Test-Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\WindowsUpdate\\Auto Update\\RebootRequired"
if ($RebootPending) {
  Write-Host "⚠️  Reboot required to complete updates" -ForegroundColor Yellow
}`,
      },
    ],
  },
  {
    category: "Network",
    icon: Wifi,
    color: "from-cyan-500 to-cyan-600",
    scripts: [
      {
        name: "Network Diagnostics",
        desc: "Test connectivity, DNS, ping, and traceroute",
        params: [{ key: "target", label: "Target Host", placeholder: "8.8.8.8 or domain.com" }],
        generate: (p: Record<string, string>) => `# Network Diagnostics
$Target = "${p.target || "8.8.8.8"}"
Write-Host "🌐 Network Diagnostics for: $Target" -ForegroundColor Cyan

# Ping test
Write-Host "\n📡 Ping Test:" -ForegroundColor Yellow
$Ping = Test-Connection $Target -Count 4 -ErrorAction SilentlyContinue
if ($Ping) {
  $Avg = ($Ping | Measure-Object ResponseTime -Average).Average
  Write-Host "  ✅ Reachable | Avg: $([math]::Round($Avg))ms" -ForegroundColor Green
} else {
  Write-Host "  ❌ UNREACHABLE" -ForegroundColor Red
}

# DNS Resolution
Write-Host "\n🔍 DNS Resolution:" -ForegroundColor Yellow
try {
  $DNS = Resolve-DnsName $Target -ErrorAction Stop
  Write-Host "  ✅ $Target → $($DNS[0].IPAddress)" -ForegroundColor Green
} catch {
  Write-Host "  ❌ DNS resolution failed" -ForegroundColor Red
}

# Traceroute (first 10 hops)
Write-Host "\n🗺️  Traceroute (10 hops):" -ForegroundColor Yellow
tracert -h 10 $Target | Select-Object -Skip 4 | Select-Object -First 10`,
      },
      {
        name: "Map Network Drive",
        desc: "Map a network drive for a user",
        params: [
          { key: "letter", label: "Drive Letter", placeholder: "Z" },
          { key: "path", label: "Network Path", placeholder: "\\\\server\\share" },
          { key: "username", label: "Username (optional)", placeholder: "domain\\user" },
        ],
        generate: (p: Record<string, string>) => `# Map Network Drive
$Letter = "${p.letter || "Z"}"
$Path = "${p.path || "\\\\\\\\server\\\\share"}"
$Username = "${p.username || ""}"

# Remove existing mapping if any
if (Test-Path "$($Letter):") {
  net use "$($Letter):" /delete /yes
  Write-Host "🗑️  Removed existing $($Letter): mapping" -ForegroundColor Yellow
}

# Map the drive
if ($Username) {
  $Password = Read-Host "Enter password for $Username" -AsSecureString
  $BSTR = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
  $PlainPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
  net use "$($Letter):" $Path /user:$Username $PlainPass /persistent:yes
} else {
  net use "$($Letter):" $Path /persistent:yes
}

if (Test-Path "$($Letter):") {
  Write-Host "✅ Drive $($Letter): mapped to $Path" -ForegroundColor Green
} else {
  Write-Host "❌ Failed to map drive" -ForegroundColor Red
}`,
      },
    ],
  },
];

export default function AutomationPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeScript, setActiveScript] = useState(0);
  const [params, setParams] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const cat = AUTOMATION_SCRIPTS[activeCategory];
  const script = cat?.scripts[activeScript];

  const generate = () => {
    if (script) {
      setGenerated(script.generate(params));
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    toast("Script copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const askAI = () => {
    const q = `Generate and explain: ${script?.name} PowerShell script`;
    router.push(`/dashboard/chat?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Automation Scripts</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">One-click PowerShell script generator for common IT tasks</p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left panel — categories + scripts */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          {AUTOMATION_SCRIPTS.map((cat, ci) => (
            <div key={cat.category} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => { setActiveCategory(ci); setActiveScript(0); setGenerated(""); setParams({}); }}
                className={cn("w-full flex items-center gap-3 px-4 py-3 text-left transition-colors", ci === activeCategory ? "bg-gray-50 dark:bg-gray-800" : "")}
              >
                <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0", cat.color)}>
                  <cat.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.category}</span>
                <span className="ml-auto text-xs text-gray-400">{cat.scripts.length}</span>
              </button>

              {ci === activeCategory && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {cat.scripts.map((s, si) => (
                    <button
                      key={s.name}
                      onClick={() => { setActiveScript(si); setGenerated(""); setParams({}); }}
                      className={cn(
                        "w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors",
                        si === activeScript
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      <ChevronRight className={cn("w-3 h-3 flex-shrink-0", si === activeScript ? "text-blue-500" : "text-gray-400")} />
                      <span className="text-xs font-medium">{s.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right panel — script editor */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {script ? (
            <>
              {/* Script info */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{script.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{script.desc}</p>
                  </div>
                  <button
                    onClick={askAI}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex-shrink-0"
                  >
                    <Zap className="w-4 h-4" />
                    Ask AI
                  </button>
                </div>

                {/* Parameters */}
                {script.params.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {script.params.map((param) => (
                      <div key={param.key}>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">{param.label}</label>
                        <input
                          value={params[param.key] || ""}
                          onChange={(e) => setParams((p) => ({ ...p, [param.key]: e.target.value }))}
                          placeholder={param.placeholder}
                          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 font-mono"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={generate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/25"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate Script
                  </button>
                </div>
              </div>

              {/* Generated script */}
              {generated && (
                <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <div className="w-3 h-3 rounded-full bg-green-500/70" />
                      </div>
                      <Terminal className="w-4 h-4 text-blue-400 ml-2" />
                      <span className="text-xs text-gray-400 font-mono">PowerShell — {script.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copy}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([generated], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${script.name.replace(/\s+/g, "_")}.ps1`;
                          a.click();
                          toast("Script downloaded!", "success");
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        .ps1
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto bg-gray-950 p-4">
                    <pre className="text-sm text-gray-200 font-mono leading-relaxed whitespace-pre-wrap">{generated}</pre>
                  </div>
                </div>
              )}

              {!generated && (
                <div className="flex-1 glass-card rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Terminal className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {script.params.length > 0 ? "Fill in the parameters and click Generate Script" : "Click Generate Script to create the PowerShell code"}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 glass-card rounded-2xl flex items-center justify-center">
              <p className="text-gray-400">Select a script from the left panel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
