import re

def create_visual_metadata(page: str, idea: str, hook: str) -> dict:
    """
    Generates rich, untruncated 4-act visual metadata mapping each video
    to authentic visual primitives from the 100-component primitives library.
    """
    clean_hook = hook.strip().strip('"').strip("'")
    
    # Extract clean tool name / topic without slicing
    idea_parts = idea.split(":")
    tool_or_topic = idea_parts[0].strip()
    action = idea_parts[1].strip() if len(idea_parts) > 1 else idea_parts[0].strip()
    
    idea_lower = (idea + " " + hook).lower()

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

    # -------------------------------------------------------------
    # Multi-Primitive Selection Logic across 20 Subniches
    # -------------------------------------------------------------
    
    # 1. Agency Systems
    if page == "agencyworkflowsystems":
        if any(w in idea_lower for w in ["capacity", "hiring", "hire", "workload", "burnout", "scorecard", "margin", "deliverable"]):
            p1, p2, p3, p4 = "TeamUtilizationHeatmap", "RetainerMarginLeakDetector", "HireTriggerThresholdMeter", "DeliverableVelocityTracker"
            act1_title = f"Team Capacity Bottleneck: {tool_or_topic}"
            act2_title = "Unbilled Scope & Margin Leak"
            act3_title = "Automated Recruitment Threshold"
            act4_title = "Turnaround Benchmark Victory"
        else:
            p1, p2, p3, p4 = "OnboardingMilestoneRoadmap", "AssetIntakeInspector", "ContractToSlackTrigger", "ClientHealthScorecard"
            act1_title = f"Client Onboarding Pipeline: {tool_or_topic}"
            act2_title = "Asset & Access Inspection Stall"
            act3_title = "Automated Welcome & Slack Provisioning"
            act4_title = "24-Hour Kickoff SLA Victory"

    # 2. Freelance AI
    elif page == "ai_toolsforfreelancers":
        if any(w in idea_lower for w in ["invoice", "voice", "bill", "payment", "get paid", "pricing"]):
            p1, p2, p3, p4 = "VoiceWaveToReceipt", "OverdueChaserTimeline", "HourlyToRetainerConverter", "StripePayoutCountdown"
            act1_title = f"Voice-to-Invoice Stream: {tool_or_topic}"
            act2_title = "Overdue Payment Chaser"
            act3_title = "Retainer Value Conversion"
            act4_title = "Instant 24H Auto-Deposit"
        else:
            p1, p2, p3, p4 = "ContractRedlineScanner", "IndemnityTrapCard", "ClauseComparisonSlider", "ScopeCreepMeter"
            act1_title = f"AI Contract Redline: {tool_or_topic}"
            act2_title = "Hidden Indemnity & Liability Trap"
            act3_title = "Protected Terms Comparison"
            act4_title = "Scope Protection Active"

    # 3. Free Workflow Tools
    elif page == "freeworkflowtools":
        if any(w in idea_lower for w in ["scrape", "scraping", "lead", "enrich", "csv", "data", "browser"]):
            p1, p2, p3, p4 = "DOMElementSniffer", "ProxyRotationGauge", "CSVMergeVisualizer", "HeadlessBrowserTerminal"
            act1_title = f"Free DOM Extraction: {tool_or_topic}"
            act2_title = "Proxy Rotation & Rate Limits"
            act3_title = "Deduplicated CSV Merge"
            act4_title = "Headless CLI Execution"
        else:
            p1, p2, p3, p4 = "BatchFileRenamerStream", "MetadataScrubber", "FormatTranscodeMatrix", "LosslessCompressorCard"
            act1_title = f"Batch Asset Pipeline: {tool_or_topic}"
            act2_title = "EXIF Metadata Sanitizer"
            act3_title = "Multi-Format Transcode Matrix"
            act4_title = "Lossless File Compression"

    # 4. No Code Workflow
    elif page == "nocodeworkflow":
        if any(w in idea_lower for w in ["database", "airtable", "notion", "crm", "record", "relation"]):
            p1, p2, p3, p4 = "LinkedRecordRelation", "DeduplicationRadar", "AutomatedStatusPipeline", "FormulaRollupCounter"
            act1_title = f"Relational Database Sync: {tool_or_topic}"
            act2_title = "Duplicate Record Detection"
            act3_title = "Automated CRM Kanban Transition"
            act4_title = "Instant Rollup Aggregation"
        else:
            p1, p2, p3, p4 = "WebhookPayloadPulse", "ApiRateLimitBar", "RouterBranchSplitter", "ErrorRetryBackoff"
            act1_title = f"Webhook Payload Pulse: {tool_or_topic}"
            act2_title = "API Rate Limit Monitoring"
            act3_title = "Multi-Branch Conditional Routing"
            act4_title = "Exponential Retry Backoff"

    # 5. Workflow Tool News
    elif page == "workflowtoolnews":
        if any(w in idea_lower for w in ["llm", "claude", "gpt", "tokens", "benchmark", "context", "speed"]):
            p1, p2, p3, p4 = "TokensPerSecondTachometer", "HallucinationConfidenceGauge", "NeedleInHaystackMatrix", "CostPerMillionTokensBar"
            act1_title = f"LLM Generation Velocity: {tool_or_topic}"
            act2_title = "Hallucination & Grounding Check"
            act3_title = "1M Token Needle In Haystack"
            act4_title = "Cost-Per-Million Token Deflation"
        else:
            p1, p2, p3, p4 = "ChangelogDiffView", "PriceHikeImpactCard", "SeatTaxCalculator", "SelfHostSavingsLedger"
            act1_title = f"Silent SaaS Terms Shift: {tool_or_topic}"
            act2_title = "Stealth Seat Price Multiplication"
            act3_title = "Enterprise SSO Wall Exposed"
            act4_title = "Self-Hosted Infrastructure Savings"

    # 6. Automate Your Side Hustle
    elif page == "automateyoursidehustle":
        if any(w in idea_lower for w in ["content", "video", "repurpose", "podcast", "post", "social", "shorts"]):
            p1, p2, p3, p4 = "LongformSplitter", "PlatformAspectRatioMorph", "AutoHashtagOptimizer", "OmniChannelCalendarGrid"
            act1_title = f"Longform Content Splitter: {tool_or_topic}"
            act2_title = "Dynamic Aspect Ratio Morph"
            act3_title = "Semantic Hashtag Optimization"
            act4_title = "30-Day Multi-Feed Schedule"
        else:
            p1, p2, p3, p4 = "GumroadSaleNotification", "AbandonedCartSequence", "InventorySyncBridge", "DigitalAssetVaultDelivery"
            act1_title = f"Automated Digital Checkout: {tool_or_topic}"
            act2_title = "Abandoned Cart Recovery Trigger"
            act3_title = "Multi-Channel Inventory Sync"
            act4_title = "Encrypted Vault Asset Delivery"

    # 7. Startup Workflow Cuts
    elif page == "startupworkflowcuts":
        if any(w in idea_lower for w in ["mvp", "prototype", "validate", "feedback", "user", "launch"]):
            p1, p2, p3, p4 = "LandingPageWireframeBuild", "UserFeedbackCluster", "FeaturePrioritizationQuadrant", "SmokeTestConversionCard"
            act1_title = f"72-Hour MVP Assembly: {tool_or_topic}"
            act2_title = "Beta Feedback Cluster"
            act3_title = "Core Feature Prioritization"
            act4_title = "Smoke Test Validation Victory"
        else:
            p1, p2, p3, p4 = "ZombieSeatDetector", "CloudComputeTrimBar", "SingleSignOnConsolidation", "RunwayMonthsGauge"
            act1_title = f"Zombie SaaS Seat Hunt: {tool_or_topic}"
            act2_title = "Idle Cloud Compute Trim"
            act3_title = "Single Workspace Consolidation"
            act4_title = "Runway Extended 3x"

    # 8. Workflow Tool Compared
    elif page == "workflowtoolcompared":
        if any(w in idea_lower for w in ["note", "obsidian", "notion", "graph", "knowledge", "markdown"]):
            p1, p2, p3, p4 = "OfflineVsCloudLatency", "DataLockInWarningCard", "BlockEditorFlexibility", "GraphNodeNetwork"
            act1_title = f"Local NVMe vs Cloud Latency: {tool_or_topic}"
            act2_title = "Proprietary Data Lock-In Trap"
            act3_title = "Polymorphic Block Architecture"
            act4_title = "Interactive Knowledge Graph"
        else:
            p1, p2, p3, p4 = "InterfaceBloatScorecard", "TicketingSpeedStopwatch", "GitCommitIssueLinker", "CycleTimeBurndownChart"
            act1_title = f"UI Friction & Bloat Audit: {tool_or_topic}"
            act2_title = "Ticket Creation Latency Showdown"
            act3_title = "Automated Git Status Bridge"
            act4_title = "Sprint Cycle Time Burndown"

    # 9. Remote Team Workflow
    elif page == "remoteteamworkflow":
        if any(w in idea_lower for w in ["meeting", "zoom", "loom", "doc", "sop", "action"]):
            p1, p2, p3, p4 = "MeetingCostCalculator", "ScreenRecordingSnippet", "ActionItemAutoAssigner", "VideoToSOPTransmuter"
            act1_title = f"Live Meeting Dollar Burn: {tool_or_topic}"
            act2_title = "Async Micro-Walkthrough"
            act3_title = "Automated Action Item Extraction"
            act4_title = "Loom-to-SOP Transmutation"
        else:
            p1, p2, p3, p4 = "TimezoneGlobeOverlap", "NotificationMuteSchedule", "HandoffRelayBaton", "AsyncStandupDigest"
            act1_title = f"Global Timezone Golden Window: {tool_or_topic}"
            act2_title = "Deep Work Shield Active"
            act3_title = "24-Hour Asynchronous Relay"
            act4_title = "42-Second Bot Standup Digest"

    # 10. Workflow for Beginners
    else:
        if any(w in idea_lower for w in ["focus", "pomodoro", "distract", "habit", "priority", "burnout"]):
            p1, p2, p3, p4 = "DistractionShieldBlocker", "ContextSwitchingPenaltyMeter", "DailyPriorityPillars", "PomodoroRadialTimer"
            act1_title = f"Distraction Shield Active: {tool_or_topic}"
            act2_title = "Context-Switching Energy Drain"
            act3_title = "The Rule-of-Three Priorities"
            act4_title = "25-Minute Flow State Lock"
        else:
            p1, p2, p3, p4 = "MessyDesktopCleanup", "ISO8601NamingCard", "FolderHierarchyTree", "CloudSyncIndicator"
            act1_title = f"Automated Desktop Cleanup: {tool_or_topic}"
            act2_title = "ISO 8601 File Naming Standard"
            act3_title = "Golden 3-Click Folder Tree"
            act4_title = "3-2-1 Encrypted Cloud Backup"

    # -------------------------------------------------------------
    # Full Structured Specification
    # -------------------------------------------------------------
    return {
        "hook": {
            "chapter": "⚡ HOOK",
            "badge": f"⚡ {niche_title}",
            "line1": clean_hook,  # Complete, untruncated hook
            "line2": "FIXED IN 24 HOURS",
            "tag": f"🛑 {tool_or_topic}",
            "subtext": "Stop losing hours every week doing this manually."
        },
        "act1": {
            "chapter": "🔷 THE BOTTLENECK",
            "badge": f"{niche_title} BOTTLENECK",
            "title": act1_title,
            "primitive": p1,
            "props": {
                "title": act1_title,
                "subtitle": tool_or_topic
            }
        },
        "act2": {
            "chapter": "🛑 THE CRISIS",
            "badge": "CRITICAL BOTTLENECK",
            "title": act2_title,
            "primitive": p2,
            "props": {
                "title": act2_title,
                "subtitle": tool_or_topic
            }
        },
        "act3": {
            "chapter": "🚀 THE FIX",
            "badge": "THE AUTOMATED PIPELINE",
            "title": act3_title,
            "primitive": p3,
            "props": {
                "title": act3_title,
                "subtitle": tool_or_topic
            }
        },
        "act4": {
            "chapter": "⚡ VICTORY",
            "badge": "BENCHMARK VICTORY",
            "title": act4_title,
            "primitive": p4,
            "props": {
                "title": act4_title,
                "subtitle": tool_or_topic,
                "compositeScore": 98 if p4 == "ClientHealthScorecard" else None,
                "clientTier": "Full SLA Onboarding Victory" if p4 == "ClientHealthScorecard" else None
            }
        }
    }
