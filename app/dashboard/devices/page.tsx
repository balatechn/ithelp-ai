"use client";

import { useState } from "react";
import { Monitor, Server, Printer, Wifi, Shield, HardDrive, Search, Plus, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const DEVICES = [
  { id: "PC-001", name: "DESKTOP-SARAH", type: "pc", ip: "192.168.1.101", os: "Windows 11 Pro", ram: "16 GB", cpu: "Intel i7-12700", storage: "512 GB NVMe", status: "online", user: "Sarah Chen", location: "Floor 2, Desk 24", lastSeen: "Online now" },
  { id: "PC-002", name: "DESKTOP-MIKE", type: "pc", ip: "192.168.1.102", os: "Windows 10 Pro", ram: "8 GB", cpu: "Intel i5-10400", storage: "256 GB SSD", status: "online", user: "Mike Johnson", location: "Floor 1, Desk 10", lastSeen: "Online now" },
  { id: "SRV-001", name: "DC01-PROD", type: "server", ip: "192.168.1.10", os: "Windows Server 2022", ram: "64 GB", cpu: "Intel Xeon E5-2680", storage: "2 TB RAID", status: "online", user: "IT Team", location: "Server Room", lastSeen: "Online now" },
  { id: "SRV-002", name: "FILE-SRV01", type: "server", ip: "192.168.1.11", os: "Windows Server 2019", ram: "32 GB", cpu: "Intel Xeon E5-2670", storage: "10 TB RAID6", status: "warning", user: "IT Team", location: "Server Room", lastSeen: "Warning: Disk 80% full" },
  { id: "PRN-001", name: "HP-LASERJET-FL3", type: "printer", ip: "192.168.1.201", os: "HP LaserJet 400 M401", ram: "256 MB", cpu: "N/A", storage: "N/A", status: "offline", user: "Floor 3", location: "Floor 3, Print Room", lastSeen: "2 hours ago" },
  { id: "FW-001", name: "SOPHOS-XG-EDGE", type: "firewall", ip: "192.168.1.1", os: "Sophos XG 230", ram: "8 GB", cpu: "Quad-Core", storage: "128 GB", status: "online", user: "IT Team", location: "Network Rack", lastSeen: "Online now" },
  { id: "AP-001", name: "UNIFI-AP-FL1", type: "ap", ip: "192.168.1.210", os: "UniFi 6 LR", ram: "N/A", cpu: "N/A", storage: "N/A", status: "online", user: "Floor 1", location: "Floor 1 Ceiling", lastSeen: "Online now" },
  { id: "NAS-001", name: "SYNOLOGY-DS920", type: "nas", ip: "192.168.1.220", os: "Synology DSM 7.2", ram: "4 GB", cpu: "Celeron J4125", storage: "20 TB RAID5", status: "online", user: "IT Team", location: "Server Room", lastSeen: "Online now" },
];

const TYPE_ICONS: Record<string, typeof Monitor> = { pc: Monitor, server: Server, printer: Printer, firewall: Shield, ap: Wifi, nas: HardDrive, router: Wifi, switch: Activity };
const TYPE_COLORS: Record<string, string> = {
  pc: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  server: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
  printer: "text-pink-500 bg-pink-50 dark:bg-pink-900/20",
  firewall: "text-red-500 bg-red-50 dark:bg-red-900/20",
  ap: "text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20",
  nas: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
};

export default function DevicesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = DEVICES.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.ip.includes(search);
    const matchType = typeFilter === "all" || d.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Device Inventory</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{DEVICES.length} devices tracked</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" />Add Device
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: DEVICES.length, color: "text-blue-500" },
          { label: "Online", value: DEVICES.filter((d) => d.status === "online").length, color: "text-green-500" },
          { label: "Warning", value: DEVICES.filter((d) => d.status === "warning").length, color: "text-yellow-500" },
          { label: "Offline", value: DEVICES.filter((d) => d.status === "offline").length, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <div className={cn("text-2xl font-bold mb-1", s.color)}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-4 mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or IP..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white">
          <option value="all">All Types</option>
          <option value="pc">PC</option>
          <option value="server">Server</option>
          <option value="printer">Printer</option>
          <option value="firewall">Firewall</option>
          <option value="ap">Access Point</option>
          <option value="nas">NAS</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((device) => {
          const Icon = TYPE_ICONS[device.type] || Monitor;
          const colors = TYPE_COLORS[device.type] || TYPE_COLORS.pc;
          return (
            <div key={device.id} className="glass-card rounded-2xl p-5 card-hover cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl", colors.split(" ").slice(1).join(" "))}>
                  <Icon className={cn("w-5 h-5", colors.split(" ")[0])} />
                </div>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
                  device.status === "online" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  device.status === "warning" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>{device.status}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white font-mono text-sm mb-1">{device.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{device.ip} · {device.location}</p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[["OS", device.os], ["RAM", device.ram], ["User", device.user], ["Last Seen", device.lastSeen]].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1.5">
                    <div className="text-gray-400 mb-0.5">{k}</div>
                    <div className="text-gray-700 dark:text-gray-300 truncate">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
