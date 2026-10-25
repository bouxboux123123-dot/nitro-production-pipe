import re

def create_visual_metadata(page: str, idea: str, hook: str) -> dict:
    clean_hook = hook.strip().strip('"').strip("'")
    
    # Extract clean tool name / topic
    idea_parts = idea.split(":")
    tool_or_topic = idea_parts[0].strip()
    action = idea_parts[1].strip() if len(idea_parts) > 1 else idea_parts[0].strip()

    # Determine niche title
    niche_names = {
        "agencyworkflowsystems": "AGENCY SYSTEMS",
        "ai_toolsforfreelancers": "FREELANCE AI",
        "automateyoursidehustle": "SIDE HUSTLE AUTOMATION",
        "freeworkflowtools": "FREE POWER TOOLS",
        "nocodeworkflow": "NO-CODE WORKFLOW",
        "remoteteamworkflow": "REMOTE TEAM SYSTEMS",
        "startupworkflowcuts": "STARTUP EFFICIENCY",
        "workflowforbeginners": "WORKFLOW BASICS",
        "workflowtoolcompared": "TOOL COMPARISON",
        "workflowtoolnews": "TECH BENCHMARKS"
    }
    niche_title = niche_names.get(page, page.upper().replace("_", " "))

    # Generate 4-Act visual specifications
    return {
        "hook": {
            "chapter": "⚡ HOOK",
            "badge": f"⚡ {niche_title}",
            "line1": clean_hook[:28] + ("..." if len(clean_hook) > 28 else ""),
            "line2": "FIX IT IN 24H.",
            "tag": f"🛑 {tool_or_topic[:24]}",
            "subtext": "Stop wasting 4 hours every week doing this manually."
        },
        "act1": {
            "chapter": "🔷 THE BOTTLENECK",
            "badge": f"{niche_title} BOTTLENECK",
            "title": f"Manual {tool_or_topic[:25]}",
            "polaroid_title": f"{tool_or_topic[:20]} Stall",
            "tag1": "📁 Missing Assets & Passwords",
            "tag2": "⏳ 14 Back-and-Forth Emails",
            "tag3": "📉 Stalled Client Kickoff",
            "takeaway": "Manual chasing delays project delivery and burns team focus."
        },
        "act2": {
            "chapter": "🛑 THE CRASH",
            "badge": "CRITICAL BOTTLENECK",
            "polaroid_title": "Fatal 21-Day Stall",
            "counter_max": 1000,
            "counter_unit": "HRS LOST",
            "code_line1": "def manual_process():",
            "code_line2": "# Stalled waiting on step",
            "code_line3": "return client_delivery_delayed()",
            "error_title": "FATAL WORKFLOW DELAY",
            "error_sub": f"{tool_or_topic[:30]}: delivery stall",
            "error_desc": "Manual follow-ups failed to scale, causing client friction and lost revenue."
        },
        "act3": {
            "chapter": "🚀 THE FIX",
            "badge": "THE AUTOMATED PIPELINE",
            "polaroid_title": f"{tool_or_topic[:20]} SOP",
            "before_title": "🛑 MANUAL WAY",
            "before_tag": "SLOW",
            "before_lines": [
                "def manual_onboarding():",
                "  email_client_for_passwords()",
                "  wait_two_weeks_for_reply()",
                "  lose_track_of_assets() # 3wks"
            ],
            "before_footer": "⚠️ Projects stall for 3 weeks",
            "after_title": "⚡ AUTOMATED SOP",
            "after_tag": "INSTANT",
            "after_lines": [
                "client.sign_contract()",
                f"portal.load('{tool_or_topic[:16]}')",
                "vault.auto_verify_logins()",
                "pipeline.execute() # O(1)",
                "slack.notify_kickoff_ready()"
            ],
            "after_footer": "🚀 100% automated in under 24 hours",
            "benefit": f"Automated {tool_or_topic[:22]} runs end-to-end on autopilot."
        },
        "act4": {
            "chapter": "⚡ VICTORY",
            "badge": "BENCHMARK VICTORY",
            "polaroid_title": "5.0x Benchmark Win",
            "speedup_val": "5.0",
            "speedup_label": "FASTER KICKOFF",
            "bar1_label": f"Automated {tool_or_topic[:22]}",
            "bar1_desc": "24 Hours (100% Assets Collected)",
            "bar2_label": "Manual Email Follow-up",
            "bar2_desc": "3+ Weeks (Stalled Kickoffs)",
            "stat1_title": "KICKOFF TIME",
            "stat1_val": "24 HOURS",
            "stat2_title": "MANUAL CHASING",
            "stat2_val": "ZERO",
            "stat3_title": "CLIENT NPS",
            "stat3_val": "100%",
            "rule": f"Golden Rule: Automate {tool_or_topic[:25]} once — never chase manually again."
        }
    }
