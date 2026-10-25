/**
 * PlantGuard AI - Multilingual Translation Dictionary
 * Supports English (en), Odia (or), and Hindi (hi).
 */

const translations = {
    en: {
        // Brand & Header
        brand_title: "PlantGuard AI",
        brand_subtitle: "Smart Crop Disease & Pest Damage Diagnostic Lab",
        model_status_demo: "Demo Expert Mode",
        status_real_ai: "🟢 Real Gemini Vision AI Active",
        status_fallback: "🟡 Botanical Fallback Mode",
        lang_selector_label: "Language:",

        // Intro Banner
        intro_heading: "Protect Your Crops with AI-Assisted Leaf Diagnostics",
        intro_desc: "Upload a high-resolution photo of a crop leaf to screen for fungal/bacterial diseases, evaluate insect feeding damage, and receive verified organic & cultural treatment recommendations.",
        model_honesty_pill: "Multimodal AI Vision & Diagnostic Reasoning enabled with automatic botanical heuristic fallback.",
        ai_transparency_label: "AI Transparency:",

        // Upload Card & Field Context
        upload_card_title: "1. Upload Leaf Image",
        upload_badge: "JPG, JPEG, PNG • Max 5MB",
        drop_prompt_title: "Drag & Drop your leaf image here",
        drop_prompt_sub: "or click to browse from your device",
        btn_choose_file: "Choose File",
        btn_analyze: "🔬 Analyze Leaf Condition",
        preview_ready: "Image ready for diagnosis",
        field_context_title: "Add Field Context (Optional - Enhances AI Reasoning)",
        label_crop_name: "Plant / Crop Name:",
        label_watering: "Watering Frequency:",
        opt_select: "Select frequency...",
        opt_water_daily: "Daily watering",
        opt_water_moderate: "2-3 times per week",
        opt_water_rare: "Weekly or rarely",
        opt_water_excess: "Waterlogged / Heavy recent rain",
        label_insects: "Insects / Pests Observed?",
        opt_insect_none: "No insects visible",
        opt_insect_caterpillars: "Chewing caterpillars or beetles seen",
        opt_insect_aphids: "Tiny whiteflies or aphids on underside",
        opt_insect_mites: "Fine webbing / spider mites",

        // Samples Card
        samples_card_title: "Or Test With Sample Leaves",
        samples_badge: "Instant Demo",
        samples_desc: "Click any sample below to evaluate diagnosis without uploading your own file:",
        sample_loading: "Loading sample leaves...",

        // Sample Item Titles & Categories
        sample_healthy_title: "Healthy Tomato Leaf",
        sample_healthy_cat: "Healthy Crop",
        sample_early_blight_title: "Tomato Early Blight",
        sample_early_blight_cat: "Fungal Disease",
        sample_late_blight_title: "Potato / Tomato Late Blight",
        sample_late_blight_cat: "Oomycete Blight",
        sample_pest_title: "Caterpillar Chewed Leaf",
        sample_pest_cat: "Insect Damage",

        // Placeholder State
        placeholder_title: "Diagnostic Report Awaiting Input",
        placeholder_desc: "Upload a photo or select one of the demo samples on the left to start the diagnostic scan.",
        checklist_1: "Disease classification with confidence percentage",
        checklist_2: "Independent physical pest/insect damage assessment",
        checklist_3: "Organic, chemical, and preventive treatment guidelines",
        checklist_4: "Image clarity and out-of-distribution leaf validation",

        // Loading States
        loading_step_1_title: "Scanning leaf image structure...",
        loading_step_1_sub: "Verifying RGB color channels and resolution",
        loading_step_2_title: "Evaluating pathological lesions...",
        loading_step_2_sub: "Measuring chlorosis, necrosis, and pustule patterns",
        loading_step_3_title: "Analyzing pest damage & perforations...",
        loading_step_3_sub: "Inspecting leaf margins and insect chew holes",
        loading_step_4_title: "Synthesizing treatment plan...",
        loading_step_4_sub: "Matching organic and cultural recommendations",

        // Error Banner
        error_default_title: "Image Rejection Notice",
        btn_dismiss: "Dismiss",

        // Uncertainty & Follow-up
        uncertainty_heading: "AI Diagnostic Reasoning & Uncertainty",
        followup_title: "Follow-up Questions from AI:",

        // Result Card (Disease)
        tag_disease: "Primary Pathogen Diagnosis",
        farmer_callout_title: "🌾 Farmer Advisory Note:",
        metric_confidence: "Confidence",
        metric_severity: "Severity",
        label_pathogen: "Pathogen / Cause:",
        label_causes: "Environmental / Biological Factors:",
        symptoms_heading: "Observed Pathological Symptoms",
        differentials_heading: "Alternative Differential Diagnoses",

        // Pest Card
        tag_pest: "Pest & Insect Damage Evaluation",
        pest_detected_prefix: "Physical leaf tissue loss or damage detected with",
        pest_clean_prefix: "No visible insect chewing perforations or leaf-mining channels detected",
        label_culprits: "Possible Culprits / Vectors:",
        ipm_heading: "Integrated Pest Management (IPM) Guidance",

        // Treatment Tabs
        tab_organic: "🌱 Organic & Bio Solutions",
        tab_prevention: "🛡️ Cultural Prevention",
        tab_chemical: "🧪 Chemical Treatment",
        organic_heading: "Eco-Friendly & Organic Treatments",
        prevention_heading: "Long-Term Prevention Practices",
        chemical_heading: "Chemical Treatment Options",
        chemical_alert: "Precaution Notice: Chemical treatments should only be used as a last resort when threshold damage is reached. Always wear protective gear and follow pre-harvest intervals.",

        // Transparency Card
        transparency_heading: "Diagnostic Model Transparency & Legal Disclaimer",
        disclaimer_prefix: "Notice: PlantGuard AI diagnostic predictions are computer-assisted educational estimates and are not guaranteed.",

        // Severity Levels
        sev_none: "None",
        sev_mild: "Mild",
        sev_moderate: "Moderate",
        sev_high: "High",
        sev_critical: "Severe / Critical",

        // Navigation
        nav_lab: "Diagnostic Lab",
        nav_chat: "Plant AI Chat",

        // Standalone AI Chat Page & Assistant
        chat_page_title: "PlantGuard AI Assistant",
        chat_page_subtitle: "ChatGPT-style AI Assistant — Ask ANY question on science, coding, history, general knowledge, or crop diseases and plant care.",
        btn_new_chat: "+ New Chat",
        btn_reset_chat: "↺ Reset Chat",
        btn_send: "Send",
        chat_input_placeholder: "Ask any question in English, ଓଡ଼ିଆ, or हिन्दी...",
        chat_disclaimer_note: "⚠️ PlantGuard AI provides general knowledge & agricultural guidance. Always verify critical recommendations.",
        chat_missing_key_warning: "⚠️ Gemini API key is not configured on the server. Please add GEMINI_API_KEY in the server .env file to enable live AI chat.",
        chat_typing: "PlantGuard AI is thinking...",
        chat_initial_greeting: "Hello! I am your PlantGuard AI Assistant. You can ask me ANY question — general knowledge, science, mathematics, coding, history, or plant health and gardening in English & Odia. How can I help you today?",
        chat_error_prefix: "Error:",
        chat_retry: "Retry",
        retry_ai_analysis: "🔄 Retry Real AI Vision Analysis",
        temporary_error_retry_prompt: "Gemini AI temporarily unavailable (high demand or rate limit). Click below to retry:",

        // Persistent Floating Assistant Widget
        floating_assistant_btn: "AI Assistant",
        assistant_panel_title: "PlantGuard AI Assistant",
        assistant_panel_subtitle: "Ask ANY question — general knowledge, science, everyday topics, or plant health",
        assistant_panel_status: "ChatGPT-Style AI",
        assistant_welcome_greeting: "Hello! I am your PlantGuard AI Assistant. You can ask me ANY question — from science, coding, and history to crop health, organic remedies, and gardening in English & Odia. How can I help you today?",
        assistant_input_placeholder: "Ask anything in English or ଓଡ଼ିଆ...",
        assistant_disclaimer: "PlantGuard AI can make mistakes. Verify important advice.",
        btn_open_full_chat: "Full Page ⤢",
        btn_close_panel: "Close",

        // Quick suggestions for standalone chat & floating widget
        chat_chip_1: "What is artificial intelligence (AI)?",
        chat_chip_2: "How does photosynthesis work in plants?",
        chat_chip_3: "How do I prevent tomato blight organically?",
        chat_chip_4: "Best organic remedy for aphids & sucking pests",

        // Report Follow-up Chat specific
        tag_report_chat: "AI Agronomist Follow-up",
        report_chat_title: "Ask Follow-up Questions About This Report",
        report_chat_subtitle: "Have questions about symptoms, organic remedies, prevention, or next steps for this diagnosed issue? Ask below:",
        report_chat_placeholder: "Ask a follow-up question about this diagnosis...",
        report_chip_1: "How fast will this condition spread?",
        report_chip_2: "Can I use organic neem spray for this?",
        report_chip_3: "What immediate action should I take today?",
        report_chip_4: "How should I adjust watering now?",

        // Footer
        footer_brand: "PlantGuard AI",
        footer_tech: "Built with Python, Flask, and Plant Pathology Science",
        footer_note: "Crafted for agricultural sustainability and transparent pair programming."
    },

    or: {
        // Brand & Header
        brand_title: "ପ୍ଲାଣ୍ଟଗାର୍ଡ AI (PlantGuard AI)",
        brand_subtitle: "ଉନ୍ନତ ଫସଲ ରୋଗ ଓ କୀଟ କ୍ଷତି ପରୀକ୍ଷାଗାର",
        model_status_demo: "ଡେମୋ ଏକ୍ସପର୍ଟ ମୋଡ୍",
        status_real_ai: "🟢 ବାସ୍ତବ Gemini Vision AI ସକ୍ରିୟ",
        status_fallback: "🟡 ବଟାନିକାଲ୍ ଫଲବ୍ୟାକ୍ ମୋଡ୍",
        lang_selector_label: "ଭାଷା (Language):",

        // Intro Banner
        intro_heading: "AI ସହାୟତାରେ ପତ୍ର ପରୀକ୍ଷା କରି ନିଜ ଫସଲକୁ ସୁରକ୍ଷିତ ରଖନ୍ତୁ",
        intro_desc: "ପତ୍ରର ଫଟୋ ଅପଲୋଡ୍ କରି ଫିମ୍ପି ଓ ଜୀବାଣୁଜନିତ ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ, କୀଟପତଙ୍ଗର କ୍ଷତି ଜାଣନ୍ତୁ ଏବଂ ବିଶ୍ୱସନୀୟ ଜୈବିକ ତଥା ପ୍ରତିରୋଧକ ଉପଚାର ପରାମର୍ଶ ପାଆନ୍ତୁ।",
        model_honesty_pill: "ପ୍ରକୃତ Multimodal AI Vision ସହିତ ସ୍ୱତଃସ୍ଫୂର୍ତ୍ତ ଉଦ୍ଭିଦ ବିଜ୍ଞାନ ଫଲବ୍ୟାକ୍ ବ୍ୟବସ୍ଥା ଉପଲବ୍ଧ।",
        ai_transparency_label: "AI ସ୍ୱଚ୍ଛତା (Transparency):",

        // Upload Card & Field Context
        upload_card_title: "୧. ପତ୍ରର ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ",
        upload_badge: "JPG, JPEG, PNG • ସର୍ବାଧିକ 5MB",
        drop_prompt_title: "ଏଠାରେ ପତ୍ରର ଫଟୋ ଡ୍ରାଗ୍ ଓ ଡ୍ରପ୍ କରନ୍ତୁ",
        drop_prompt_sub: "କିମ୍ବା ଡିଭାଇସ୍ ରୁ ଫାଇଲ୍ ବାଛିବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ",
        btn_choose_file: "ଫାଇଲ୍ ବାଛନ୍ତୁ",
        btn_analyze: "🔬 ପତ୍ର ରୋଗ ପରୀକ୍ଷା କରନ୍ତୁ",
        preview_ready: "ପରୀକ୍ଷା ପାଇଁ ଫଟୋ ପ୍ରସ୍ତୁତ",
        field_context_title: "କ୍ଷେତ୍ର ବିବରଣୀ ଯୋଡ଼ନ୍ତୁ (ଇଚ୍ଛାଧୀନ - AI ସଠିକତା ବୃଦ୍ଧି ପାଇଁ)",
        label_crop_name: "ଫସଲ / ଗଛର ନାମ:",
        label_watering: "ପାଣି ଦେବା ନିୟମ:",
        opt_select: "ପାଣି ନିୟମ ବାଛନ୍ତୁ...",
        opt_water_daily: "ପ୍ରତିଦିନ ପାଣି ଦିଆଯାଏ",
        opt_water_moderate: "ସପ୍ତାହରେ ୨-୩ ଥର",
        opt_water_rare: "ସପ୍ତାହରେ ଥରେ ବା କମ୍",
        opt_water_excess: "ପାଣି ଜମି ରହିଛି / ପ୍ରବଳ ବର୍ଷା",
        label_insects: "କୌଣସି ପୋକ ଦେଖାଯାଉଛନ୍ତି କି?",
        opt_insect_none: "କୌଣସି ପୋକ ଦେଖାଯାଉ ନାହାଁନ୍ତି",
        opt_insect_caterpillars: "ପତ୍ର କଟା ଶୁଅପୋକ ବା ପୋକ ଦେଖାଯାଇଛି",
        opt_insect_aphids: "ପତ୍ର ତଳେ ଧଳା ବା କଳା କ୍ଷୁଦ୍ର ପୋକ",
        opt_insect_mites: "ସୂକ୍ଷ୍ମ ଜାଲି / ଲାଲ୍ ବୁଢ଼ିଆଣୀ ପୋକ",

        // Samples Card
        samples_card_title: "କିମ୍ବା ନମୁନା ପତ୍ରରେ ତୁରନ୍ତ ଟେଷ୍ଟ୍ କରନ୍ତୁ",
        samples_badge: "ତୁରନ୍ତ ଡେମୋ",
        samples_desc: "ନିଜେ ଫଟୋ ଅପଲୋଡ୍ ନକରି ତଳେ ଥିବା ଯେକୌଣସି ନମୁନା ପତ୍ର ଉପରେ କ୍ଲିକ୍ କରି ପରୀକ୍ଷା କରନ୍ତୁ:",
        sample_loading: "ନମୁନା ପତ୍ର ଲୋଡ୍ ହେଉଛି...",

        // Sample Item Titles & Categories
        sample_healthy_title: "ସୁସ୍ଥ ବିଲାତି ବାଇଗଣ ପତ୍ର",
        sample_healthy_cat: "ନିରୋଗ ଫସଲ",
        sample_early_blight_title: "ବିଲାତି ଆଗୁଆ ଝାଉଁଳା (Early Blight)",
        sample_early_blight_cat: "ଫିମ୍ପିଜନିତ ରୋଗ",
        sample_late_blight_title: "ଆଳୁ / ବିଲାତି ପଛୁଆ ଝାଉଁଳା (Late Blight)",
        sample_late_blight_cat: "ପଚା ରୋଗ (Blight)",
        sample_pest_title: "ଶୁଅପୋକ ଖାଇଥିବା ପତ୍ର",
        sample_pest_cat: "କୀଟପତଙ୍ଗ କ୍ଷତି",

        // Placeholder State
        placeholder_title: "ପରୀକ୍ଷା ରିପୋର୍ଟ ପାଇଁ ଅପେକ୍ଷା କରାଯାଇଛି",
        placeholder_desc: "ବାମ ପାର୍ଶ୍ୱରେ ଏକ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ କିମ୍ବା ଏକ ନମୁନା ପତ୍ର ବାଛି ଡାଏଗ୍ନୋଷ୍ଟିକ୍ ସ୍କାନ୍ ଆରମ୍ଭ କରନ୍ତୁ।",
        checklist_1: "ନିର୍ଭୁଲତା ପ୍ରତିଶତ (Confidence %) ସହିତ ରୋଗ ଚିହ୍ନଟ",
        checklist_2: "ପୃଥକ୍ ଭାବେ କୀଟପତଙ୍ଗ ଦ୍ୱାରା ହୋଇଥିବା କ୍ଷତିର ମୂଲ୍ୟାଙ୍କନ",
        checklist_3: "ଜୈବିକ, ରାସାୟନିକ ଏବଂ ପ୍ରତିରୋଧକ ଚିକିତ୍ସା ନିର୍ଦ୍ଦେଶାବଳୀ",
        checklist_4: "ଫଟୋର ସ୍ପଷ୍ଟତା ଏବଂ ପତ୍ର ପରିଚୟ ଯାଞ୍ଚ",

        // Loading States
        loading_step_1_title: "ପତ୍ରର ଗଠନ ସ୍କାନ୍ କରାଯାଉଛି...",
        loading_step_1_sub: "RGB ରଙ୍ଗ ଏବଂ ରେଜୋଲ୍ୟୁସନ୍ ଯାଞ୍ଚ ହେଉଛି",
        loading_step_2_title: "ରୋଗର ଲକ୍ଷଣ ବିଶ୍ଳେଷଣ ହେଉଛି...",
        loading_step_2_sub: "ହଳଦିଆ ପଡ଼ିବା, କଳା ଦାଗ ଓ ଫିମ୍ପି ଯାଞ୍ଚ ହେଉଛି",
        loading_step_3_title: "କୀଟପତଙ୍ଗ କ୍ଷତି ଓ ପତ୍ର କଣା ପରୀକ୍ଷା ହେଉଛି...",
        loading_step_3_sub: "ପତ୍ରର ଧାର ଏବଂ ପୋକ ଖାଇଥିବା କଣା ଯାଞ୍ଚ ହେଉଛି",
        loading_step_4_title: "ଉପଚାର ଯୋଜନା ପ୍ରସ୍ତୁତ ହେଉଛି...",
        loading_step_4_sub: "ଉପଯୁକ୍ତ ଜୈବିକ ଓ କୃଷି ପରାମର୍ଶ ଖୋଜାଯାଉଛି",

        // Error Banner
        error_default_title: "ଫଟୋ ପ୍ରତ୍ୟାଖ୍ୟାନ ସୂଚନା",
        btn_dismiss: "ବନ୍ଦ କରନ୍ତୁ",

        // Uncertainty & Follow-up
        uncertainty_heading: "AI ବିଶ୍ଳେଷଣ ଓ ଅନିଶ୍ଚିତତା ସୂଚନା",
        followup_title: "ଅଧିକ ସଠିକତା ପାଇଁ AI ପ୍ରଶ୍ନ:",

        // Result Card (Disease)
        tag_disease: "ପ୍ରାଥମିକ ରୋଗ ନିର୍ଣ୍ଣୟ (Pathogen Diagnosis)",
        farmer_callout_title: "🌾 ଚାଷୀ ଭାଇଙ୍କ ପାଇଁ ସରଳ ବୁଝାମଣା:",
        metric_confidence: "ନିର୍ଭୁଲତା (Confidence)",
        metric_severity: "ତୀବ୍ରତା (Severity)",
        label_pathogen: "ରୋଗଜୀବାଣୁ / କାରଣ:",
        label_causes: "ପରିବେଶ ଓ ଜୈବିକ କାରଣ:",
        symptoms_heading: "ପରିଲକ୍ଷିତ ରୋଗ ଲକ୍ଷଣ",
        differentials_heading: "ଅନ୍ୟାନ୍ୟ ସମ୍ଭାବ୍ୟ ବିକଳ୍ପ ରୋଗ (Differential Diagnoses)",

        // Pest Card
        tag_pest: "କୀଟପତଙ୍ଗ କ୍ଷତି ମୂଲ୍ୟାଙ୍କନ (Pest Damage)",
        pest_detected_prefix: "ପତ୍ର ଖିଆଯାଇଥିବା ବା କ୍ଷତିଗ୍ରସ୍ତ ହୋଇଥିବାର ସୂଚନା ମିଳିଛି, ନିର୍ଭୁଲତା:",
        pest_clean_prefix: "କୌଣସି ପୋକ ଖାଇଥିବା କଣା କିମ୍ବା ଟନେଲ୍ ଦେଖାଯାଇ ନାହିଁ",
        label_culprits: "ସମ୍ଭାବ୍ୟ କୀଟପତଙ୍ଗ (Possible Culprits):",
        ipm_heading: "ସମନ୍ୱିତ କୀଟ ପରିଚାଳନା (IPM) ନିର୍ଦ୍ଦେଶାବଳୀ",

        // Treatment Tabs
        tab_organic: "🌱 ଜୈବିକ ଉପଚାର (Organic)",
        tab_prevention: "🛡️ ସତର୍କତା ଓ ପ୍ରତିରୋଧ (Prevention)",
        tab_chemical: "🧪 ରାସାୟନିକ ଚିକିତ୍ସା (Chemical)",
        organic_heading: "ପରିବେଶ ଅନୁକୂଳ ଜୈବିକ ଚିକିତ୍ସା",
        prevention_heading: "ଦୀର୍ଘକାଳୀନ ରୋଗ ପ୍ରତିରୋଧକ ବ୍ୟବସ୍ଥା",
        chemical_heading: "ରାସାୟନିକ ଉପଚାର ବିକଳ୍ପ",
        chemical_alert: "ସତର୍କତା ସୂଚନା: ରାସାୟନିକ କୀଟନାଶକ କେବଳ ଚରମ ସ୍ଥିତିରେ ବ୍ୟବହାର କରନ୍ତୁ। ପ୍ରୟୋଗ ସମୟରେ ସୁରକ୍ଷା ପୋଷାକ ପିନ୍ଧନ୍ତୁ ଏବଂ ଫସଲ ଅମଳ ସମୟ ବ୍ୟବଧାନ (PHI) ନିଶ୍ଚୟ ପାଳନ କରନ୍ତୁ।",

        // Transparency Card
        transparency_heading: "AI ମଡେଲ୍ ସ୍ୱଚ୍ଛତା ଏବଂ କୃଷି ସତର୍କତା ବାର୍ତ୍ତା",
        disclaimer_prefix: "ସୂଚନା: PlantGuard AI ଦ୍ୱାରା ଦିଆଯାଇଥିବା ଫଳାଫଳ ଏକ କମ୍ପ୍ୟୁଟର-ସହାୟକ ଶିକ୍ଷଣୀୟ ଆକଳନ ଏବଂ ଏହା ଶତପ୍ରତିଶତ ଆଇନଗତ ଗ୍ୟାରେଣ୍ଟି ନୁହେଁ।",

        // Severity Levels
        sev_none: "କିଛି ନାହିଁ (None)",
        sev_mild: "ସାମାନ୍ୟ (Mild)",
        sev_moderate: "ମଧ୍ୟମ (Moderate)",
        sev_high: "ଅଧିକ (High)",
        sev_critical: "ଅତ୍ୟନ୍ତ ଗୁରୁତର (Critical)",

        // Navigation
        nav_lab: "ପତ୍ର ରୋଗ ପରୀକ୍ଷାଗାର",
        nav_chat: "କୃଷି AI ଚାଟ୍",

        // Standalone AI Chat Page & Assistant
        chat_page_title: "ପ୍ଲାଣ୍ଟଗାର୍ଡ AI ସହାୟକ",
        chat_page_subtitle: "ChatGPT-ଶୈଳୀ AI ସହାୟକ — ବିଜ୍ଞାନ, କୋଡିଂ, ଇତିହାସ, ସାଧାରଣ ଜ୍ଞାନ କିମ୍ବା ଫସଲ ରୋଗ ଓ ଗଛ ଯତ୍ନ ବିଷୟରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।",
        btn_new_chat: "+ ନୂତନ ଚାଟ୍",
        btn_reset_chat: "↺ ପୁନର୍ବାର ଆରମ୍ଭ",
        btn_send: "ପଠାନ୍ତୁ",
        chat_input_placeholder: "ଓଡ଼ିଆ କିମ୍ବା ଇଂରାଜୀରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...",
        chat_disclaimer_note: "⚠️ ଏହା କେବଳ ସାଧାରଣ ଶିକ୍ଷା ଓ ମାର୍ଗଦର୍ଶନ ପାଇଁ। ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସୂଚନା ଯାଞ୍ଚ କରିବା ଉଚିତ।",
        chat_missing_key_warning: "⚠️ ସର୍ଭରରେ Gemini API Key କନଫିଗର୍ ହୋଇନାହିଁ। ଲାଇଭ୍ AI ଚାଟ୍ ପାଇଁ ଦୟାକରି .env ଫାଇଲ୍ ରେ GEMINI_API_KEY ଯୋଡ଼ନ୍ତୁ।",
        chat_typing: "ପ୍ଲାଣ୍ଟଗାର୍ଡ AI ଉତ୍ତର ପ୍ରସ୍ତୁତ କରୁଛି...",
        chat_initial_greeting: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ପ୍ଲାଣ୍ଟଗାର୍ଡ AI ସହାୟକ। ଆପଣ ମୋତେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରିପାରିବେ — ସାଧାରଣ ଜ୍ଞାନ, ବିଜ୍ଞାନ, କୋଡିଂ, ଇତିହାସଠାରୁ ଆରମ୍ଭ କରି ଫସଲ ରୋଗ, ଜୈବିକ ଉପଚାର ଓ ଗଛ ଯତ୍ନ ପର୍ଯ୍ୟନ୍ତ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
        chat_error_prefix: "ତ୍ରୁଟି:",
        chat_retry: "ପୁନଃଚେଷ୍ଟା କରନ୍ତୁ",
        retry_ai_analysis: "🔄 ବାସ୍ତବ AI ବିଶ୍ଳେଷଣ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ",
        temporary_error_retry_prompt: "ଜେମିନାଇ AI ଅସ୍ଥାୟୀ ଭାବେ ବ୍ୟସ୍ତ (ଅଧିକ ଚାପ ବା ରେଟ୍ ଲିମିଟ୍)। ପୁନର୍ବାର ଚେଷ୍ଟା କରିବାକୁ କ୍ଲିକ୍ କରନ୍ତୁ:",

        // Persistent Floating Assistant Widget
        floating_assistant_btn: "AI ସହାୟକ",
        assistant_panel_title: "ପ୍ଲାଣ୍ଟଗାର୍ଡ AI ସହାୟକ",
        assistant_panel_subtitle: "ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ — ସାଧାରଣ ଜ୍ଞାନ, ବିଜ୍ଞାନ, କୋଡିଂ କିମ୍ବା ଫସଲ ଯତ୍ନ",
        assistant_panel_status: "ChatGPT-ଶୈଳୀ AI",
        assistant_welcome_greeting: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ପ୍ଲାଣ୍ଟଗାର୍ଡ AI ସହାୟକ। ଆପଣ ମୋତେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରିପାରିବେ — ସାଧାରଣ ଜ୍ଞାନ, ବିଜ୍ଞାନ, ଇତିହାସଠାରୁ ଆରମ୍ଭ କରି ଫସଲ ରୋଗ, ଜୈବିକ ଉପଚାର ଓ ଗଛ ଯତ୍ନ ପର୍ଯ୍ୟନ୍ତ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
        assistant_input_placeholder: "ଇଂରାଜୀ ବା ଓଡ଼ିଆରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...",
        assistant_disclaimer: "PlantGuard AI ଦ୍ୱାରା ପ୍ରଦତ୍ତ ସୂଚନା ଯାଞ୍ଚ କରିବା ଉଚିତ।",
        btn_open_full_chat: "ପୂରା ପେଜ୍ ⤢",
        btn_close_panel: "ବନ୍ଦ କରନ୍ତୁ",

        // Quick suggestions for standalone chat & floating widget
        chat_chip_1: "କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା (AI) କ’ଣ ଏବଂ କିପରି କାମ କରେ?",
        chat_chip_2: "ଉଦ୍ଭିଦ କିପରି ଆଲୋକଶ୍ଳେଷଣ ପ୍ରକ୍ରିୟାରେ ଖାଦ୍ୟ ପ୍ରସ୍ତୁତ କରେ?",
        chat_chip_3: "ବିଲାତିରେ ଝାଉଁଳା ରୋଗ ଜୈବିକ ଉପାୟରେ କିପରି ରୋକିବି?",
        chat_chip_4: "ଘର ବଗିଚା ପାଇଁ ସର୍ବୋତ୍ତମ ଜୈବିକ ଖତ କ’ଣ?",

        // Report Follow-up Chat specific
        tag_report_chat: "AI ବିଶେଷଜ୍ଞ ପରାମର୍ଶ",
        report_chat_title: "ଏହି ରିପୋର୍ଟ ସମ୍ପର୍କରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ",
        report_chat_subtitle: "ଏହି ରୋଗ ବା କୀଟର ଚିକିତ୍ସା, ପ୍ରତିରୋଧ କିମ୍ବା ଆଗାମୀ ପଦକ୍ଷେପ ବିଷୟରେ ପଚାରନ୍ତୁ:",
        report_chat_placeholder: "ଏହି ପରୀକ୍ଷା ରିପୋର୍ଟ ବିଷୟରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...",
        report_chip_1: "ଏହି ରୋଗ କେତେ ଶୀଘ୍ର ବ୍ୟାପିପାରେ?",
        report_chip_2: "ଏଥିପାଇଁ ନିମ୍ବ ତେଲ ବ୍ୟବହାର କରିପାରିବି କି?",
        report_chip_3: "ଆଜି ତୁରନ୍ତ ମୋତେ କ’ଣ କରିବାକୁ ହେବ?",
        report_chip_4: "ବର୍ତ୍ତମାନ କେତେ ଦିନରେ ପାଣି ଦେବା ଉଚିତ୍?",

        // Footer
        footer_brand: "ପ୍ଲାଣ୍ଟଗାର୍ଡ AI (PlantGuard AI)",
        footer_tech: "Python, Flask ଏବଂ ଉଦ୍ଭିଦ ବିଜ୍ଞାନ ଉପରେ ଆଧାରିତ",
        footer_note: "କୃଷି ସ୍ଥିରତା ଏବଂ ସ୍ୱଚ୍ଛତା ପାଇଁ ପ୍ରସ୍ତୁତ।"
    },

    hi: {
        // Brand & Header
        brand_title: "प्लांटगार्ड AI (PlantGuard AI)",
        brand_subtitle: "उन्नत फसल रोग एवं कीट क्षति निदान प्रयोगशाला",
        model_status_demo: "डेमो एक्सपर्ट मोड",
        status_real_ai: "🟢 वास्तविक Gemini Vision AI सक्रिय",
        status_fallback: "🟡 वनस्पति फॉलबैक मोड",
        lang_selector_label: "भाषा (Language):",

        // Intro Banner
        intro_heading: "AI की मदद से पत्तों की जांच कर अपनी फसलों को सुरक्षित रखें",
        intro_desc: "पत्ती की स्पष्ट फोटो अपलोड करें और फंगल/बैक्टीरियल रोगों का पता लगाएं, कीट क्षति का मूल्यांकन करें तथा प्रमाणित जैविक व सुरक्षात्मक उपचार सुझाव प्राप्त करें।",
        model_honesty_pill: "मल्टीमॉडल AI विज़न निदान के साथ स्वचालित वनस्पति फॉलबैक सिस्टम उपलब्ध है।",
        ai_transparency_label: "AI पारदर्शिता (Transparency):",

        // Upload Card & Field Context
        upload_card_title: "१. पत्ती की फोटो अपलोड करें",
        upload_badge: "JPG, JPEG, PNG • अधिकतम 5MB",
        drop_prompt_title: "पत्ती की फोटो यहां ड्रैग और ड्रॉप करें",
        drop_prompt_sub: "या डिवाइस से फ़ाइल चुनने के लिए क्लिक करें",
        btn_choose_file: "फ़ाइल चुनें",
        btn_analyze: "🔬 पत्ती की जांच करें",
        preview_ready: "निदान के लिए फोटो तैयार है",
        field_context_title: "खेत/फसल संदर्भ जोड़ें (वैकल्पिक - AI सटीकता बढ़ाने हेतु)",
        label_crop_name: "पौधे / फसल का नाम:",
        label_watering: "पानी देने की आवृत्ति:",
        opt_select: "आवृत्ति चुनें...",
        opt_water_daily: "रोजाना पानी",
        opt_water_moderate: "सप्ताह में २-३ बार",
        opt_water_rare: "सप्ताह में एक बार या कम",
        opt_water_excess: "जलभराव / हाल ही में भारी बारिश",
        label_insects: "क्या कोई कीड़े दिखाई दे रहे हैं?",
        opt_insect_none: "कोई कीड़े नहीं दिख रहे",
        opt_insect_caterpillars: "पत्ती कुतरने वाली इल्लियां/कीड़े दिखे",
        opt_insect_aphids: "पत्ती के नीचे सफेद मक्खी या एफिड्स",
        opt_insect_mites: "बारीक जाला / लाल मकड़ी (माइट्स)",

        // Samples Card
        samples_card_title: "या नमूना पत्तियों से तुरंत परीक्षण करें",
        samples_badge: "त्वरित डेमो",
        samples_desc: "बिना फोटो अपलोड किए तुरंत परीक्षण के लिए नीचे दिए गए किसी भी नमूने पर क्लिक करें:",
        sample_loading: "नमूना पत्तियां लोड हो रही हैं...",

        // Sample Item Titles & Categories
        sample_healthy_title: "स्वस्थ टमाटर की पत्ती",
        sample_healthy_cat: "स्वस्थ फसल",
        sample_early_blight_title: "टमाटर का अगेती झुलसा (Early Blight)",
        sample_early_blight_cat: "फंगल रोग",
        sample_late_blight_title: "आलू / टमाटर का पछेती झुलसा (Late Blight)",
        sample_late_blight_cat: "उकठा / झुलसा रोग",
        sample_pest_title: "कीट द्वारा खाई गई पत्ती",
        sample_pest_cat: "कीट क्षति",

        // Placeholder State
        placeholder_title: "निदान रिपोर्ट इनपुट की प्रतीक्षा में है",
        placeholder_desc: "बाईं ओर एक फोटो अपलोड करें या डेमो नमूनों में से एक चुनें और डायग्नोस्टिक स्कैन शुरू करें।",
        checklist_1: "सटीकता प्रतिशत (Confidence %) के साथ रोग की पहचान",
        checklist_2: "कीटों द्वारा पहुंचाई गई शारीरिक क्षति का स्वतंत्र मूल्यांकन",
        checklist_3: "जैविक, रासायनिक एवं निवारक उपचार दिशा-निर्देश",
        checklist_4: "छवि स्पष्टता और पत्ती पहचान सत्यापन",

        // Loading States
        loading_step_1_title: "पत्ती की संरचना स्कैन हो रही है...",
        loading_step_1_sub: "RGB रंग और रिज़ॉल्यूशन की पुष्टि की जा रही है",
        loading_step_2_title: "रोग लक्षणों का विश्लेषण किया जा रहा है...",
        loading_step_2_sub: "पीलापन, काले धब्बे और फफूंद पैटर्न की गणना हो रही है",
        loading_step_3_title: "कीट क्षति और छेदों की जांच हो रही है...",
        loading_step_3_sub: "पत्ती के किनारों और कीड़ों के चबाने के निशानों की जांच",
        loading_step_4_title: "उपचार योजना तैयार की जा रही है...",
        loading_step_4_sub: "उचित जैविक एवं कृषि सुझावों का मिलान",

        // Error Banner
        error_default_title: "फोटो अस्वीकृति सूचना",
        btn_dismiss: "बंद करें",

        // Uncertainty & Follow-up
        uncertainty_heading: "AI डायग्नोस्टिक तर्क एवं अनिश्चितता विवरण",
        followup_title: "अधिक सटीकता के लिए AI प्रश्न:",

        // Result Card (Disease)
        tag_disease: "प्राथमिक रोगज़नक़ निदान (Primary Diagnosis)",
        farmer_callout_title: "🌾 किसान भाइयों के लिए सरल समझ:",
        metric_confidence: "सटीकता (Confidence)",
        metric_severity: "गंभीरता (Severity)",
        label_pathogen: "रोगज़नक़ / कारण:",
        label_causes: "पर्यावरणीय एवं जैविक कारक:",
        symptoms_heading: "लक्षित रोग लक्षण",
        differentials_heading: "अन्य संभावित वैकल्पिक रोग (Differential Diagnoses)",

        // Pest Card
        tag_pest: "कीट क्षति मूल्यांकन (Pest Damage Evaluation)",
        pest_detected_prefix: "पत्ती के ऊतक नुकसान या कीट क्षति की पहचान हुई, सटीकता:",
        pest_clean_prefix: "कोई स्पष्ट कीट छेद या लीफ-माइनर सुरंग नहीं पाई गई",
        label_culprits: "संभावित कीट (Possible Culprits):",
        ipm_heading: "एकीकृत कीट प्रबंधन (IPM) दिशा-निर्देश",

        // Treatment Tabs
        tab_organic: "🌱 जैविक उपचार (Organic)",
        tab_prevention: "🛡️ रोकथाम व सुरक्षा (Prevention)",
        tab_chemical: "🧪 रासायनिक उपचार (Chemical)",
        organic_heading: "पर्यावरण-अनुकूल जैविक उपचार",
        prevention_heading: "दीर्घकालिक रोग निवारण पद्धतियां",
        chemical_heading: "रासायनिक उपचार विकल्प",
        chemical_alert: "सावधानी सूचना: रासायनिक दवाओं का उपयोग अंतिम उपाय के रूप में ही करें। छिड़काव के समय सुरक्षात्मक मास्क/दस्ताने पहनें और फसल तुड़ाई अंतराल (PHI) का पालन करें।",

        // Transparency Card
        transparency_heading: "AI मॉडल पारदर्शिता एवं कृषि अस्वीकरण (Disclaimer)",
        disclaimer_prefix: "सूचना: PlantGuard AI द्वारा दिए गए परिणाम कंप्यूटर-सहायित शैक्षिक अनुमान हैं और शत-प्रतिशत कानूनी गारंटी नहीं हैं।",

        // Severity Levels
        sev_none: "कोई नहीं (None)",
        sev_mild: "हल्की (Mild)",
        sev_moderate: "मध्यम (Moderate)",
        sev_high: "उच्च (High)",
        sev_critical: "अति गंभीर (Critical)",

        // Navigation
        nav_lab: "पत्ती रोग निदान लैब",
        nav_chat: "कृषि AI चैट",

        // Standalone AI Chat Page & Assistant
        chat_page_title: "प्लांटगार्ड AI सहायक",
        chat_page_subtitle: "ChatGPT-शैली AI सहायक — विज्ञान, कोडिंग, इतिहास, सामान्य ज्ञान या फसल रोग व पौधों की देखभाल पर कोई भी प्रश्न पूछें।",
        btn_new_chat: "+ नई बातचीत",
        btn_reset_chat: "↺ रीसेट",
        btn_send: "भेजें",
        chat_input_placeholder: "हिन्दी या अंग्रेजी में कोई भी प्रश्न पूछें...",
        chat_disclaimer_note: "⚠️ यह सामान्य शिक्षा और निर्णय मार्गदर्शन हेतु है। महत्वपूर्ण जानकारी की पुष्टि करें।",
        chat_missing_key_warning: "⚠️ सर्वर पर Gemini API Key कॉन्फ़िगर नहीं है। लाइव AI चैट के लिए कृपया .env फ़ाइल में GEMINI_API_KEY जोड़ें।",
        chat_typing: "प्लांटगार्ड AI सोच रहा है...",
        chat_initial_greeting: "नमस्ते! मैं आपका प्लांटगार्ड AI सहायक हूँ। आप मुझसे कोई भी प्रश्न पूछ सकते हैं — सामान्य ज्ञान, विज्ञान, गणित, कोडिंग, इतिहास से लेकर फसल रोग, जैविक उपचार और बागवानी तक। आज मैं आपकी क्या सहायता कर सकता हूँ?",
        chat_error_prefix: "त्रुटि:",
        chat_retry: "पुनः प्रयास करें",
        retry_ai_analysis: "🔄 वास्तविक AI विश्लेषण पुनः प्रयास करें",
        temporary_error_retry_prompt: "जेमिनी AI अस्थायी रूप से व्यस्त है। पुनः प्रयास करने के लिए नीचे क्लिक करें:",

        // Persistent Floating Assistant Widget
        floating_assistant_btn: "AI सहायक",
        assistant_panel_title: "प्लांटगार्ड AI सहायक",
        assistant_panel_subtitle: "कोई भी सवाल पूछें — सामान्य ज्ञान, विज्ञान, कोडिंग या पौधों की देखभाल",
        assistant_panel_status: "ChatGPT-शैली AI",
        assistant_welcome_greeting: "नमस्ते! मैं आपका प्लांटगार्ड AI सहायक हूँ। आप मुझसे कोई भी प्रश्न पूछ सकते हैं — सामान्य ज्ञान, विज्ञान, कोडिंग से लेकर फसल रोग और बागवानी तक। आज मैं आपकी क्या सहायता कर सकता हूँ?",
        assistant_input_placeholder: "अंग्रेजी या हिन्दी में कुछ भी पूछें...",
        assistant_disclaimer: "PlantGuard AI गलतियां कर सकता है। महत्वपूर्ण जानकारी की पुष्टि करें।",
        btn_open_full_chat: "पूरा पेज ⤢",
        btn_close_panel: "बंद करें",

        // Quick suggestions for standalone chat & floating widget
        chat_chip_1: "आर्टिफिशियल इंटेलिजेंस (AI) क्या है और कैसे काम करता है?",
        chat_chip_2: "पौधे प्रकाश संश्लेषण द्वारा भोजन कैसे बनाते हैं?",
        chat_chip_3: "टमाटर में झुलसा रोग की जैविक रोकथाम कैसे करें?",
        chat_chip_4: "घर के बगीचे के लिए सबसे अच्छी जैविक खाद क्या है?",

        // Report Follow-up Chat specific
        tag_report_chat: "AI विशेषज्ञ परामर्श",
        report_chat_title: "इस रिपोर्ट के बारे में सवाल पूछें",
        report_chat_subtitle: "इस बीमारी या कीट के उपचार, रोकथाम या लक्षणों के बारे में पूछें:",
        report_chat_placeholder: "इस रिपोर्ट के बारे में कोई सवाल पूछें...",
        report_chip_1: "यह बीमारी कितनी तेज़ी से फैल सकती है?",
        report_chip_2: "क्या इसके लिए नीम का तेल प्रयोग कर सकते हैं?",
        report_chip_3: "आज तुरंत क्या कदम उठाना चाहिए?",
        report_chip_4: "अब पानी कितने दिन में देना चाहिए?",

        // Footer
        footer_brand: "प्लांटगार्ड AI (PlantGuard AI)",
        footer_tech: "Python, Flask और पादप रोग विज्ञान पर आधारित",
        footer_note: "कृषि स्थिरता और पारदर्शी प्रोग्रामिंग के लिए समर्पित।"
    }
};

// Condition name localizer helper (Preserves English & scientific accuracy)
const conditionLocalizations = {
    "Early Blight": {
        or: "ଆଗୁଆ ଝାଉଁଳା ରୋଗ (Early Blight)",
        hi: "अगेती झुलसा रोग (Early Blight)"
    },
    "Tomato Early Blight": {
        or: "ବିଲାତି ଆଗୁଆ ଝାଉଁଳା ରୋଗ (Tomato Early Blight)",
        hi: "टमाटर का अगेती झुलसा रोग (Tomato Early Blight)"
    },
    "Late Blight": {
        or: "ପଛୁଆ ଝାଉଁଳା ରୋଗ (Late Blight)",
        hi: "पछेती झुलसा रोग (Late Blight)"
    },
    "Tomato Late Blight": {
        or: "ବିଲାତି ପଛୁଆ ଝାଉଁଳା ରୋଗ (Tomato Late Blight)",
        hi: "टमाटर का पछेती झुलसा रोग (Tomato Late Blight)"
    },
    "Potato Late Blight": {
        or: "ଆଳୁ ପଛୁଆ ଝାଉଁଳା ରୋଗ (Potato Late Blight)",
        hi: "आलू का पछेती झुलसा रोग (Potato Late Blight)"
    },
    "Common Rust": {
        or: "ମକା ଗିରି / କଳଙ୍କୀ ରୋଗ (Common Rust)",
        hi: "मक्का का रतुआ रोग (Common Rust)"
    },
    "Corn Common Rust": {
        or: "ମକା କଳଙ୍କୀ ରୋଗ (Corn Common Rust)",
        hi: "मक्का का रतुआ रोग (Corn Common Rust)"
    },
    "Apple Scab": {
        or: "ସେଓ ସ୍କାବ୍ / କାଛୁ ରୋଗ (Apple Scab)",
        hi: "सेब का स्कैब रोग (Apple Scab)"
    },
    "Bacterial Spot": {
        or: "ଜୀବାଣୁଜନିତ ଚିତା ରୋଗ (Bacterial Spot)",
        hi: "जीवाणु धब्बा रोग (Bacterial Spot)"
    },
    "Bell Pepper Bacterial Spot": {
        or: "ଲଙ୍କା ଜୀବାଣୁ ଚିତା ରୋଗ (Bacterial Spot)",
        hi: "शिमला मिर्च जीवाणु धब्बा रोग (Bacterial Spot)"
    },
    "Black Rot": {
        or: "ଅଙ୍ଗୁର କଳା ପଚା ରୋଗ (Black Rot)",
        hi: "अंगूर का काला सड़न रोग (Black Rot)"
    },
    "Grape Black Rot": {
        or: "ଅଙ୍ଗୁର କଳା ପଚା ରୋଗ (Grape Black Rot)",
        hi: "अंगूर का काला सड़न रोग (Grape Black Rot)"
    },
    "Healthy Plant Tissue": {
        or: "ସୁସ୍ଥ ଓ ନିରୋଗ ଫସଲ (Healthy Crop)",
        hi: "स्वस्थ पादप ऊतक (Healthy Plant Tissue)"
    },
    "Healthy Leaf": {
        or: "ସୁସ୍ଥ ଓ ନିରୋଗ ପତ୍ର (Healthy Leaf)",
        hi: "स्वस्थ एवं नीरोग पत्ती (Healthy Leaf)"
    },
    "Healthy Crop": {
        or: "ସୁସ୍ଥ ଓ ନିରୋଗ ଫସଲ (Healthy Crop)",
        hi: "स्वस्थ फसल (Healthy Crop)"
    }
};
