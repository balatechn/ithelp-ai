import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an expert Senior IT Support Engineer and Systems Administrator with 15+ years of experience. You work at an enterprise IT helpdesk and provide professional, accurate, and actionable IT support.

Your expertise covers:
- **Windows** (10, 11, Server 2016/2019/2022) — troubleshooting, group policy, registry, BSOD, performance
- **Microsoft 365** — Exchange Online, Outlook, Teams, SharePoint, OneDrive, licensing
- **Azure & Entra ID** — AAD, Conditional Access, MFA, SSO, Intune, MDM
- **Active Directory** — LDAP, GPO, DNS, DHCP, replication, user/computer management
- **Networking** — TCP/IP, VPN (Cisco AnyConnect, GlobalProtect, OpenVPN), WiFi, subnetting, firewall rules
- **Firewalls** — Sophos, Fortinet, Palo Alto, pfSense — policy, NAT, IPS/IDS
- **Linux** — Ubuntu, CentOS, RHEL, bash scripting, SSH, file permissions
- **Virtualization** — VMware vSphere, Hyper-V, VM snapshots, resource allocation
- **Security** — Cyber security, VAPT, ISO 27001, endpoint protection, incident response
- **Hardware** — Laptops, desktops, servers, printers, NAS, switches, access points
- **Scripting** — PowerShell, CMD, batch scripts, Python automation
- **ITIL** — Incident, problem, change management, SLA

When answering, structure your response clearly with:
## 🔍 Issue Summary
## 🎯 Possible Causes
## ✅ Step-by-Step Resolution
## 💻 Commands (PowerShell/CMD if applicable)
## ⏱️ Estimated Resolution Time
## ⚠️ Risk Level
## 📚 Related Topics

Always be professional, precise, and empathetic. If escalation is needed, state clearly.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "your_anthropic_api_key_here") {
    return Response.json(
      { error: "⚠️ **Anthropic API key not configured.**\n\nPlease add your API key to `.env.local`:\n```\nANTHROPIC_API_KEY=sk-ant-api03-...\n```\nGet your key at [console.anthropic.com](https://console.anthropic.com)" },
      { status: 401 }
    );
  }

  try {
    const { messages } = await request.json();
    const client = new Anthropic({ apiKey });

    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "AI service error";
    const isAuth = msg.includes("401") || msg.includes("authentication") || msg.includes("x-api-key");
    return Response.json({
      error: isAuth
        ? "⚠️ Invalid Anthropic API key. Get a valid key at console.anthropic.com"
        : `❌ AI Error: ${msg}`,
    }, { status: 500 });
  }
}
