"""
Plant Disease Knowledge Base
Contains verified botanical pathology information, symptoms, preventive actions,
and treatments for common crop leaf diseases in English, Odia, and Hindi.
Uses simple, farmer-friendly language designed for agricultural accessibility.
"""

DISEASE_DATABASE = {
    "tomato_early_blight": {
        "crop": "Tomato (Solanum lycopersicum)",
        "crop_or": "ବିଲାତି ବାଇଗଣ (Tomato)",
        "crop_hi": "टमाटर (Tomato)",
        "condition": "Early Blight",
        "condition_or": "ପତ୍ରରେ ଚକଡ଼ା ଦାଗ ହେଉଥିବା ରୋଗ - ଆଗୁଆ ଝାଉଁଳା (Early Blight)",
        "condition_hi": "टमाटर का अगेती झुलसा रोग (Early Blight)",
        "pathogen": "Alternaria solani (Fungus)",
        "pathogen_or": "ଅଲଟର୍ଣ୍ଣାରିଆ ସୋଲାନି (ଫିମ୍ପିଜନିତ ରୋଗଜୀବାଣୁ)",
        "pathogen_hi": "अल्टरनेरिया सोलानी (फंगल रोगज़नक़)",
        "severity": "Moderate to High",
        "severity_or": "ମଧ୍ୟମରୁ ଅଧିକ",
        "severity_hi": "मध्यम से अधिक",
        "farmer_explanation_or": "ଏହା ଏକ ଫିମ୍ପି ରୋଗ। ଏଥିରେ ପତ୍ର ଉପରେ ଗୋଲ୍ ଗୋଲ୍ ମାଟିଆ ରଙ୍ଗର ଚକଡ଼ା ଦାଗ ହୋଇ ପତ୍ର ହଳଦିଆ ପଡ଼ି ତଳେ ଝଡ଼ିପଡ଼େ।",
        "symptoms": [
            "Concentric rings forming 'bullseye' pattern brown spots on older leaves",
            "Yellow halo surrounding the necrotic lesions",
            "Lower leaves wilt, turn yellow, and drop prematurely"
        ],
        "symptoms_or": [
            "ପୁରୁଣା ତଳ ପତ୍ର ଉପରେ ଗୋଲ୍ ଗୋଲ୍ ମାଟିଆ ରଙ୍ଗର ଲକ୍ଷ୍ୟବିନ୍ଦୁ (Bullseye) ଭଳି ଚକଡ଼ା ଦାଗ ହେବା।",
            "ଦାଗ ଚାରିପାଖରେ ପତ୍ରଟି ହଳଦିଆ ପଡ଼ିଯିବା।",
            "ଗଛର ତଳ ପତ୍ର ଗୁଡ଼ିକ ଶୁଖି ହଳଦିଆ ହୋଇ ଅକାଳରେ ତଳେ ଝଡ଼ିପଡ଼ିବା।"
        ],
        "causes": "High humidity, prolonged leaf wetness, and temperatures between 24-29°C.",
        "causes_or": "ଅଧିକ ଆର୍ଦ୍ରତା, ପତ୍ର ଉପରେ ଦୀର୍ଘ ସମୟ ପାଣି ଜମି ରହିବା ଏବଂ ଉଷୁମ ପାଗ ଯୋଗୁଁ ଏହି ଫିମ୍ପି ବ୍ୟାପିଥାଏ।",
        "prevention": [
            "Practice 2-3 year crop rotation away from solanaceous crops (potato, eggplant, pepper).",
            "Use drip irrigation instead of overhead watering to keep foliage dry.",
            "Mulch around the base of the plant to prevent soil-borne spores from splashing onto leaves.",
            "Prune bottom suckers and lower foliage up to 12 inches above soil to promote airflow."
        ],
        "prevention_or": [
            "ଗଛ ଉପରୁ ପାଣି ନ ଢାଳି କେବଳ ଚେର ମୂଳରେ ପାଣି ଦିଅନ୍ତୁ, ଯେପରି ପତ୍ର ଓଦା ନ ରୁହେ।",
            "ଗଛ ମୂଳରେ ନଡ଼ା କିମ୍ବା ଶୁଖିଲା ଘାସର ଆଚ୍ଛାଦନ (ମଲଚିଂ) ଦିଅନ୍ତୁ, ଯାହାଦ୍ୱାରା ମାଟିର ପାଣି ଛିଟିକି ପତ୍ରରେ ଲାଗିବ ନାହିଁ।",
            "ଗଛର ତଳ ୧ ଫୁଟ୍ ଉଚ୍ଚତା ପର୍ଯ୍ୟନ୍ତ ଶାଖା ଓ ପତ୍ର ସଫା ରଖନ୍ତୁ ଯାହାଦ୍ୱାରା ତଳେ ପବନ ଚଳାଚଳ ଭଲ ହେବ।",
            "ଏହି ଜମିରେ ୨-୩ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ଲଗାତାର ବିଲାତି ବାଇଗଣ, ଆଳୁ କିମ୍ବା ଲଙ୍କା ଲଗାନ୍ତୁ ନାହିଁ (ଫସଲ ବଦଳ କରନ୍ତୁ)।"
        ],
        "organic_treatment": [
            "Apply copper-based fungicide or sulfur powder at the very first sign of concentric spots.",
            "Spray bio-fungicide containing Bacillus subtilis (e.g., Serenade).",
            "Remove and safely burn or trash infected lower leaves immediately (do not compost)."
        ],
        "organic_treatment_or": [
            "ରୋଗ ହୋଇଥିବା ତଳ ପତ୍ର ଗୁଡ଼ିକୁ ତୁରନ୍ତ ଛିଣ୍ଡାଇ ଦୂରରେ ପୋତି ଦିଅନ୍ତୁ ବା ନଷ୍ଟ କରନ୍ତୁ (ଖତ ଗଦାରେ ପକାନ୍ତୁ ନାହିଁ)।",
            "ପ୍ରତି ଲିଟର ପାଣିରେ ୨ ରୁ ୩ ଗ୍ରାମ୍ ତମ୍ବାଯୁକ୍ତ ଜୈବିକ ଔଷଧ (Copper Fungicide) ମିଶାଇ ପତ୍ରରେ ସିଞ୍ଚନ କରନ୍ତୁ।",
            "ନିୟମିତ ଭାବେ ନିମ୍ବ ତେଲ (Neem Oil 5ml/L) ସ୍ପ୍ରେ କରି ଗଛର ପ୍ରତିରୋଧକ ଶକ୍ତି ବଢ଼ାନ୍ତୁ।"
        ],
        "chemical_treatment": [
            "Chlorothalonil, Mancozeb, or Azoxystrobin applied every 7-10 days under wet conditions.",
            "Always follow label safety directions and pre-harvest interval (PHI) guidelines."
        ],
        "chemical_treatment_or": [
            "ଯଦି ରୋଗ ଅଧିକ ବ୍ୟାପିଥାଏ, କୃଷି ବିଶେଷଜ୍ଞଙ୍କ ପରାମର୍ଶ ନେଇ ମାଙ୍କୋଜେବ୍ (Mancozeb 2g/L) କିମ୍ବା କ୍ଲୋରୋଥାଲୋନିଲ୍ ସିଞ୍ଚନ କରନ୍ତୁ।",
            "ସାବଧାନତା: ଔଷଧ ସିଞ୍ଚନ ସମୟରେ ମୁହଁରେ ମାସ୍କ ଓ ହାତରେ ଗ୍ଲୋଭସ୍ ପିନ୍ଧନ୍ତୁ ଏବଂ ଫସଲ ଅମଳର ଅତିକମରେ ୧ ସପ୍ତାହ ପୂର୍ବରୁ ସିଞ୍ଚନ ବନ୍ଦ ରଖନ୍ତୁ।"
        ]
    },
    "tomato_late_blight": {
        "crop": "Tomato (Solanum lycopersicum)",
        "crop_or": "ବିଲାତି ବାଇଗଣ (Tomato)",
        "crop_hi": "टमाटर (Tomato)",
        "condition": "Late Blight",
        "condition_or": "ପତ୍ର ଓ ଗଛକୁ ଶୀଘ୍ର ପଚାଇଦେଉଥିବା ରୋଗ - ପଛୁଆ ଝାଉଁଳା (Late Blight)",
        "condition_hi": "टमाटर का पछेती झुलसा रोग (Late Blight)",
        "pathogen": "Phytophthora infestans (Oomycete)",
        "pathogen_or": "ଫାଇଟୋଫଥୋରା ଇନଫେଷ୍ଟାନ୍ସ (ପଚା ରୋଗଜୀବାଣୁ)",
        "pathogen_hi": "फाइटोफ्थोरा इन्फेस्टन्स",
        "severity": "Severe / Critical",
        "severity_or": "ଅତ୍ୟନ୍ତ ଗୁରୁତର",
        "severity_hi": "अति गंभीर",
        "farmer_explanation_or": "କୁହୁଡ଼ିଆ ଓ ଥଣ୍ଡା ଓଦାଳିଆ ପାଗରେ ଏହି ରୋଗ ଦ୍ରୁତ ଗତିରେ ପତ୍ର, ଡାଳ ଓ ଫଳକୁ ପଚାଇ ନଷ୍ଟ କରିଦିଏ। ଏହା କିଛି ଦିନରେ ସମ୍ପୂର୍ଣ୍ଣ କ୍ଷେତ ନଷ୍ଟ କରିପାରେ।",
        "symptoms": [
            "Large, irregular water-soaked pale-green to dark brown lesions on leaves and stems",
            "White, cottony fungal growth on the underside of leaves during damp conditions",
            "Rapid collapse and browning of foliage, resembling frost damage"
        ],
        "symptoms_or": [
            "ପତ୍ର ଓ ଡାଳ ଉପରେ ପାଣି ଭିଜିଲା ଭଳି ଅନିୟମିତ କଳା-ମାଟିଆ ବଡ଼ ବଡ଼ ପଚା ଦାଗ ହେବା।",
            "ସକାଳେ କାକର ଥିବା ସମୟରେ ପତ୍ରର ତଳ ପାର୍ଶ୍ୱରେ ଧଳା ରଙ୍ଗର ତୂଳା ଭଳି ଫିମ୍ପି ଦେଖାଯିବା।",
            "ଗଛର ପତ୍ର ଗୁଡ଼ିକ ନିଆଁରେ ପୋଡ଼ିଗଲା ଭଳି କଳା ପଡ଼ି ହଠାତ୍ ମରିଯିବା।"
        ],
        "causes": "Cool, wet, cloudy weather with relative humidity above 90% and temperatures around 15-21°C.",
        "causes_or": "ଥଣ୍ଡା, କୁହୁଡ଼ିଆ ଏବଂ କ୍ରମାଗତ ଓଦାଳିଆ ପାଗ (ତାପମାତ୍ରା ୧୫-୨୧°C) ଏହି ରୋଗକୁ ଦ୍ରୁତ ଗତିରେ ବଢ଼ାଇଥାଏ।",
        "prevention": [
            "Plant certified disease-free transplants and resistant tomato cultivars.",
            "Destroy volunteer potato and tomato plants in the surrounding area.",
            "Ensure wide plant spacing for rapid canopy drying."
        ],
        "prevention_or": [
            "ସୁସ୍ଥ ଓ ନିରୋଗ ବିହନ ବା ଚାରା ବ୍ୟବହାର କରନ୍ତୁ।",
            "ଗଛ ଗୁଡ଼ିକ ମଧ୍ୟରେ ଉପଯୁକ୍ତ ଦୂରତା ରଖନ୍ତୁ ଯାହାଦ୍ୱାରା ପତ୍ର ଶୀଘ୍ର ଶୁଖିପାରିବ।",
            "କ୍ଷେତ ପାଖରେ ଥିବା ପୁରୁଣା ଆଳୁ ବା ବିଲାତି ବାଉଙ୍ଗା ଗଛ ନଷ୍ଟ କରିଦିଅନ୍ତୁ।"
        ],
        "organic_treatment": [
            "Fixed copper sprays applied protectively before rain events.",
            "Severely infected plants must be removed in plastic bags on a dry day and destroyed."
        ],
        "organic_treatment_or": [
            "ଅତ୍ୟଧିକ ରୋଗାକ୍ରାନ୍ତ ଗଛକୁ ତୁରନ୍ତ ମୂଳରୁ ଉପାଡ଼ି ପଲିଥିନ୍ ମୁଣାରେ ଭରି ନଷ୍ଟ କରନ୍ତୁ, ଯେପରି ଅନ୍ୟ ଗଛକୁ ଡେଇଁବ ନାହିଁ।",
            "ବର୍ଷା ବା କୁହୁଡ଼ି ପୂର୍ବରୁ ପ୍ରତିରୋଧକ ଭାବେ କପର ଅକ୍ସିକ୍ଲୋରାଇଡ୍ (Copper Oxychloride 2.5g/L) ସ୍ପ୍ରେ କରନ୍ତୁ।"
        ],
        "chemical_treatment": [
            "Fungicides with active ingredients like Cymoxanil, Dimethomorph, or Mandipropamid.",
            "Note: Curative treatment is difficult; preventive application is paramount."
        ],
        "chemical_treatment_or": [
            "ଲକ୍ଷଣ ଦେଖାଦେବା ମାତ୍ରେ ସାଇମୋକ୍ସାନିଲ୍ + ମାଙ୍କୋଜେବ୍ (Cymoxanil + Mancozeb) କିମ୍ବା ଡାଇମେଥୋମର୍ଫ ଔଷଧ ସିଞ୍ଚନ କରନ୍ତୁ।",
            "ସାବଧାନତା: ଏହି ରୋଗ ବହୁତ ଶୀଘ୍ର ବ୍ୟାପେ, ତେଣୁ ବିଳମ୍ବ ନକରି ସ୍ଥାନୀୟ କୃଷି ଅଧିକାରୀଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।"
        ]
    },
    "potato_late_blight": {
        "crop": "Potato (Solanum tuberosum)",
        "crop_or": "ଆଳୁ (Potato)",
        "crop_hi": "आलू (Potato)",
        "condition": "Late Blight",
        "condition_or": "ଆଳୁ ଗଛକୁ ପଚାଇ ନଷ୍ଟ କରୁଥିବା ରୋଗ - ପଛୁଆ ଝାଉଁଳା (Potato Late Blight)",
        "condition_hi": "आलू का पछेती झुलसा रोग (Late Blight)",
        "pathogen": "Phytophthora infestans (Oomycete)",
        "pathogen_or": "ଫାଇଟୋଫଥୋରା ଇନଫେଷ୍ଟାନ୍ସ",
        "pathogen_hi": "फाइटोफ्थोरा इन्फेस्टन्स",
        "severity": "Severe / Critical",
        "severity_or": "ଅତ୍ୟନ୍ତ ଗୁରୁତର",
        "severity_hi": "अति गंभीर",
        "farmer_explanation_or": "ଆଳୁ ଫସଲର ସବୁଠାରୁ ବିପଜ୍ଜନକ ପଚା ରୋଗ। ଏହା ପତ୍ରରୁ ଆରମ୍ଭ ହୋଇ ତଳେ ଥିବା ଆଳୁକୁ ମଧ୍ୟ ପଚାଇ ଦୁର୍ଗନ୍ଧଯୁକ୍ତ କରିଦିଏ।",
        "symptoms": [
            "Irregular water-soaked black-brown lesions on leaves and petioles",
            "Delicate white fungal ring on underside of affected leaf edges in morning dew",
            "Foul decaying odor in heavily infested fields"
        ],
        "symptoms_or": [
            "ପତ୍ର ଏବଂ ଡାଳ ଉପରେ କଳା-ମାଟିଆ ଓଦାଳିଆ ପଚା ଦାଗ ହେବା।",
            "ସକାଳ କାକରରେ ପତ୍ର ତଳେ ଧଳା ରଙ୍ଗର ପତଳା ଫିମ୍ପି ଦେଖାଯିବା।",
            "ଅଧିକ ଆକ୍ରାନ୍ତ କ୍ଷେତରୁ ପଚା ଦୁର୍ଗନ୍ଧ ବାହାରିବା।"
        ],
        "causes": "High humidity, prolonged leaf wetness, and cool temperatures (16-22°C).",
        "causes_or": "ଥଣ୍ଡା ପାଗ (୧୬-୨୨°C), କୁହୁଡ଼ି ଏବଂ ଲଗାତାର ଓଦା ପତ୍ର ରହିବା କାରଣରୁ ଏହା ହୁଏ।",
        "prevention": [
            "Use only certified seed potatoes free of pathogen.",
            "Hill potatoes well to shield developing tubers from washed-down spores.",
            "Avoid overhead irrigation, especially late in the day."
        ],
        "prevention_or": [
            "କେବଳ ବିଶୋଧିତ ଓ ନିରୋଗ ଆଳୁ ବିହନ ବ୍ୟବହାର କରନ୍ତୁ।",
            "ଆଳୁ ମୂଳରେ ଭଲ ଭାବରେ ମାଟି ଟେକି ଦିଅନ୍ତୁ (Hilling), ଯାହାଦ୍ୱାରା ପାଣିରେ ଫିମ୍ପି ଧୋଇ ହୋଇ ତଳ ଆଳୁକୁ ଛୁଇଁବ ନାହିଁ।",
            "ସନ୍ଧ୍ୟା ବେଳେ ଉପରୁ ପାଣି ସିଞ୍ଚନ କରନ୍ତୁ ନାହିଁ।"
        ],
        "organic_treatment": [
            "Copper hydroxide or copper sulfate preventive sprays.",
            "Eliminate cull piles where pathogen overwinters."
        ],
        "organic_treatment_or": [
            "ପ୍ରତିରୋଧକ ଭାବେ କପର ହାଇଡ୍ରୋକ୍ସାଇଡ୍ କିମ୍ବା ବୋର୍ଡୋ ମିଶ୍ରଣ (Bordeaux mixture 1%) ସ୍ପ୍ରେ କରନ୍ତୁ।",
            "ଜମି କୂଳରେ ଫିଙ୍ଗା ଯାଇଥିବା ପୁରୁଣା ପଚା ଆଳୁ ଗଦାକୁ ନଷ୍ଟ କରିଦିଅନ୍ତୁ।"
        ],
        "chemical_treatment": [
            "Mefenoxam or Mancozeb protective applications as recommended by local agricultural extension."
        ],
        "chemical_treatment_or": [
            "ରୋଗ ଦେଖାଦେଲେ ମେଟାଲାକ୍ସିଲ୍ + ମାଙ୍କୋଜେବ୍ (Metalaxyl + Mancozeb 2.5g/L) ସ୍ପ୍ରେ କରନ୍ତୁ।",
            "ସାବଧାନତା: କୀଟନାଶକ ପ୍ରୟୋଗ ସମୟରେ ନିରାପତ୍ତା ନିୟମ ମାନନ୍ତୁ।"
        ]
    },
    "apple_scab": {
        "crop": "Apple (Malus domestica)",
        "crop_or": "ସେଓ (Apple)",
        "crop_hi": "सेब (Apple)",
        "condition": "Apple Scab",
        "condition_or": "ସେଓ ପତ୍ର ଓ ଫଳର କାଛୁ ରୋଗ (Apple Scab)",
        "condition_hi": "सेब का स्कैब / दाद रोग (Apple Scab)",
        "pathogen": "Venturia inaequalis (Fungus)",
        "pathogen_or": "ଭେଞ୍ଚୁରିଆ ଇନାଇକ୍ୱାଲିସ୍ (ଫିମ୍ପି)",
        "pathogen_hi": "वेन्चुरिया इनइक्वलिस",
        "severity": "Moderate",
        "severity_or": "ମଧ୍ୟମ",
        "severity_hi": "मध्यम",
        "farmer_explanation_or": "ଏହା ଏକ ଫିମ୍ପି ରୋଗ। ଏଥିରେ ପତ୍ର ଏବଂ ଫଳ ଉପରେ କଳା-ମାଟିଆ ଖସଖସିଆ କାଛୁ ଭଳି ଦାଗ ହୁଏ ଏବଂ ଫଳ ଫାଟିଯାଏ।",
        "symptoms": [
            "Olive-green to velvety dark brown spots on upper leaf surfaces",
            "Leaves turn yellow and drop prematurely",
            "Scabby, cracked corky lesions on fruit"
        ],
        "symptoms_or": [
            "ପତ୍ରର ଉପର ଭାଗରେ ମଇଳା-ସବୁଜ ବା କଳା-ମାଟିଆ ଭେଲଭେଟ୍ ଭଳି ଦାଗ ହେବା।",
            "ପତ୍ର ହଳଦିଆ ପଡ଼ି ସମୟ ପୂର୍ବରୁ ଝଡ଼ିପଡ଼ିବା।",
            "ଫଳ ଉପରେ କାଛୁ ଭଳି ଖସଖସିଆ ଫଟା ଦାଗ ହେବା।"
        ],
        "causes": "Spring rains with extended wet periods on emerging young leaves.",
        "causes_or": "ବସନ୍ତ ଋତୁର ବର୍ଷା ଏବଂ ନୂଆ ପତ୍ର ଉପରେ ଲଗାତାର ପାଣି ଜମି ରହିବା ଯୋଗୁଁ ଏହି ରୋଗ ହୁଏ।",
        "prevention": [
            "Rake and destroy fallen leaves in autumn to eliminate overwintering ascospore sources.",
            "Prune tree canopy annually to facilitate sunlight penetration and rapid drying.",
            "Choose scab-resistant varieties (e.g., Liberty, Prima, GoldRush)."
        ],
        "prevention_or": [
            "ଶୀତ ଋତୁରେ ଗଛ ତଳେ ପଡ଼ିଥିବା ସମସ୍ତ ଶୁଖିଲା ପତ୍ର ସଂଗ୍ରହ କରି ପୋଡ଼ି ଦିଅନ୍ତୁ।",
            "ଗଛର ଡାଳପତ୍ର ଛଟାଈ (Pruning) କରନ୍ତୁ ଯାହାଦ୍ୱାରା ଭିତରକୁ ସୂର୍ଯ୍ୟ କିରଣ ଓ ପବନ ଭଲ ଭାବେ ଯାଇପାରିବ।",
            "ରୋଗ ପ୍ରତିରୋଧକ କିସମ ଲଗାନ୍ତୁ।"
        ],
        "organic_treatment": [
            "Liquid lime sulfur or potassium bicarbonate sprays during early bud break.",
            "Neem oil spray during dormant period."
        ],
        "organic_treatment_or": [
            "ଗଛରେ ନୂଆ କଢ଼ ଆସିବା ସମୟରେ ଚୂନ ଓ ଗନ୍ଧକ ମିଶ୍ରଣ (Lime Sulfur) ସିଞ୍ଚନ କରନ୍ତୁ।",
            "ନିୟମିତ ନିମ୍ବ ତେଲ ସ୍ପ୍ରେ କରନ୍ତୁ।"
        ],
        "chemical_treatment": [
            "Captan, Myclobutanil, or Difenoconazole applied during pink bud to petal fall stages."
        ],
        "chemical_treatment_or": [
            "କ୍ୟାପଟାନ୍ (Captan) କିମ୍ବା ଡିଫେନୋକୋନାଜୋଲ୍ (Difenoconazole) ଔଷଧ ନିୟମ ଅନୁସାରେ ସ୍ପ୍ରେ କରନ୍ତୁ।"
        ]
    },
    "corn_common_rust": {
        "crop": "Corn / Maize (Zea mays)",
        "crop_or": "ମକା (Corn / Maize)",
        "crop_hi": "मक्का (Corn / Maize)",
        "condition": "Common Rust",
        "condition_or": "ମକା ପତ୍ରର କଳଙ୍କୀ ବା ଗେରୁଆ ରୋଗ (Common Rust)",
        "condition_hi": "मक्के का रतुआ / गेरुआ रोग (Common Rust)",
        "pathogen": "Puccinia sorghi (Fungus)",
        "pathogen_or": "ପକ୍ସିନିଆ ସୋର୍ଗି (ଗେରୁଆ ଫିମ୍ପି)",
        "pathogen_hi": "पक्सिनिया सोर्गी",
        "severity": "Low to Moderate",
        "severity_or": "ସାମାନ୍ୟରୁ ମଧ୍ୟମ",
        "severity_hi": "कम से मध्यम",
        "farmer_explanation_or": "ଏଥିରେ ମକା ପତ୍ର ଉପରେ ଲୁହା କଳଙ୍କୀ ଭଳି ଲାଲ୍-ମାଟିଆ ରଙ୍ଗର ଛୋଟ ଛୋଟ ଫୋଟକା ଦାଗ ହୁଏ ଏବଂ ସେଥିରୁ ଧୂଳି ଭଳି ଗୁଣ୍ଡ ବାହାରେ।",
        "symptoms": [
            "Cinnamon-brown, powdery elongated pustules on both upper and lower leaf surfaces",
            "Pustules rupture epidermal tissue, releasing rust-colored airborne spores",
            "Chlorosis surrounding dense pustule clusters"
        ],
        "symptoms_or": [
            "ପତ୍ରର ଉପର ଓ ତଳ ଉଭୟ ପାର୍ଶ୍ୱରେ ଲାଲ୍-ମାଟିଆ କଳଙ୍କୀ ରଙ୍ଗର ଲମ୍ବାଳିଆ ଫୋଟକା ଦାଗ ହେବା।",
            "ଫୋଟକା ଫାଟି ଲାଲ୍-ମାଟିଆ ଗୁଣ୍ଡ ପବନରେ ଉଡ଼ିବା।",
            "ଦାଗ ଚାରିପାଖରେ ପତ୍ର ହଳଦିଆ ପଡ଼ି ଶୁଖିଯିବା।"
        ],
        "causes": "Moderate temperatures (16-25°C), high humidity, and overcast skies.",
        "causes_or": "ମଧ୍ୟମ ତାପମାତ୍ରା (୧୬-୨୫°C), ବାୟୁମଣ୍ଡଳରେ ଅଧିକ ଓଦାଳିଆ ଭାବ ଏବଂ ମେଘୁଆ ପାଗ ଯୋଗୁଁ ଏହା ବ୍ୟାପେ।",
        "prevention": [
            "Plant resistant corn hybrids with Rp gene resistance.",
            "Early planting can help crops mature before rust spore loads peak."
        ],
        "prevention_or": [
            "ରୋଗ ପ୍ରତିରୋଧକ ହାଇବ୍ରିଡ୍ ମକା ବିହନ ଲଗାନ୍ତୁ।",
            "ଋତୁ ଆରମ୍ଭରୁ ଶୀଘ୍ର ବୁଣନ୍ତୁ ଯାହାଦ୍ୱାରା ରୋଗ ବ୍ୟାପିବା ପୂର୍ବରୁ ଫସଲ ଅମଳ ହୋଇଯିବ।"
        ],
        "organic_treatment": [
            "Generally does not require organic sprays unless severity is unusually high on sweet corn.",
            "Bacillus amyloliquefaciens bio-fungicide can suppress early spore germination."
        ],
        "organic_treatment_or": [
            "ସାଧାରଣତଃ ଏହି ରୋଗରେ ଅଧିକ କ୍ଷତି ହୁଏ ନାହିଁ; ଆକ୍ରାନ୍ତ ପତ୍ର ଛିଣ୍ଡାଇ ନଷ୍ଟ କରିଦିଅନ୍ତୁ।",
            "ଜୈବିକ ଫିମ୍ପିନାଶକ ସ୍ପ୍ରେ କରାଯାଇପାରେ।"
        ],
        "chemical_treatment": [
            "Pyraclostrobin or Azoxystrobin + Propiconazole if rust appears prior to silking stage."
        ],
        "chemical_treatment_or": [
            "ମକାରେ କେଶ/ଦାନା ଆସିବା ପୂର୍ବରୁ ଯଦି ରୋଗ ଅଧିକ ହୁଏ, ତେବେ ଆଜୋକ୍ସିଷ୍ଟ୍ରୋବିନ୍ କିମ୍ବା ପ୍ରୋପିକୋନାଜୋଲ୍ (Propiconazole 1ml/L) ସ୍ପ୍ରେ କରନ୍ତୁ।"
        ]
    },
    "bell_pepper_bacterial_spot": {
        "crop": "Bell Pepper / Chilli (Capsicum annuum)",
        "crop_or": "ଶିମଲା ଲଙ୍କା ବା ଲଙ୍କା (Chilli / Pepper)",
        "crop_hi": "शिमला मिर्च / मिर्च (Chilli / Pepper)",
        "condition": "Bacterial Spot",
        "condition_or": "ଲଙ୍କା ପତ୍ରର ଜୀବାଣୁଜନିତ କଳା ଦାଗ ରୋଗ (Bacterial Leaf Spot)",
        "condition_hi": "मिर्च का जीवाणु धब्बा रोग (Bacterial Spot)",
        "pathogen": "Xanthomonas campestris (Bacterium)",
        "pathogen_or": "ଜାନ୍ଥୋମୋନାସ୍ ବ୍ୟାକ୍ଟେରିଆ (ଜୀବାଣୁ)",
        "pathogen_hi": "जैंथोमोनास जीवाणु",
        "severity": "Moderate to High",
        "severity_or": "ମଧ୍ୟମରୁ ଅଧିକ",
        "severity_hi": "मध्यम से अधिक",
        "farmer_explanation_or": "ଏହା ଏକ ଜୀବାଣୁ ରୋଗ। ଏଥିରେ ପତ୍ର ଉପରେ ଛୋଟ ଛୋଟ କଳା ଦାଗ ହୋଇ ପତ୍ର କଣା ହୋଇଯାଏ ଏବଂ ଶେଷରେ ସମସ୍ତ ପତ୍ର ଝଡ଼ି ଗଛ ଖାଲି ହୋଇଯାଏ।",
        "symptoms": [
            "Small circular water-soaked spots turning dark brown or black with yellowish halo",
            "Spots may become scab-like or drop out leaving 'shot hole' appearance",
            "Extensive leaf drop exposes fruit to sunscald"
        ],
        "symptoms_or": [
            "ପତ୍ର ଉପରେ ଛୋଟ ଛୋଟ (୧-୩ ମିମି) ପାଣିଚିଆ କଳା-ମାଟିଆ ଦାଗ ହେବା।",
            "ଦାଗ ଗୁଡ଼ିକ ଶୁଖି କଣା ହୋଇଯିବା (Shot-hole)।",
            "ପତ୍ର ଗୁଡ଼ିକ ଝଡ଼ିପଡ଼ିବା ଫଳରେ ଲଙ୍କା ଖରାରେ ପୋଡ଼ି ନଷ୍ଟ ହୋଇଯିବା।"
        ],
        "causes": "Warm temperatures (24-30°C) with frequent rainfall or overhead sprinkler irrigation.",
        "causes_or": "ଗରମ ପାଗ ଏବଂ ବାରମ୍ବାର ବର୍ଷା ବା ଉପରୁ ସ୍ପ୍ରିଙ୍କଲରରେ ପାଣି ଦେବା ଦ୍ୱାରା ଏହି ଜୀବାଣୁ ବ୍ୟାପେ।",
        "prevention": [
            "Plant certified pathogen-free seed or hot-water treated seeds.",
            "Sanitize garden tools, stakes, and flats between seasons.",
            "Avoid handling plants when leaves are wet."
        ],
        "prevention_or": [
            "ନିରୋଗ ବିହନ ବ୍ୟବହାର କରନ୍ତୁ କିମ୍ବା ବିହନକୁ ଉଷୁମ ପାଣିରେ ବିଶୋଧନ କରି ଲଗାନ୍ତୁ।",
            "ପତ୍ର ଓଦା ଥିବା ସମୟରେ ଗଛରେ କାମ କରନ୍ତୁ ନାହିଁ, ନଚେତ୍ ହାତରେ ଜୀବାଣୁ ଅନ୍ୟ ଗଛକୁ ଡେଇଁବ।",
            "ବ୍ୟବହାର କରୁଥିବା କଇଁଚି ବା ଦାଆକୁ ଡିଟଲ୍ ବା ସାବୁନ୍ ପାଣିରେ ଧୋଇ ସଫା ରଖନ୍ତୁ।"
        ],
        "organic_treatment": [
            "Copper bactericide mixed with companion Bacillus or bio-stimulants.",
            "Prompt removal of affected lower branches."
        ],
        "organic_treatment_or": [
            "ତମ୍ବାଯୁକ୍ତ ଜୀବାଣୁନାଶକ (Copper Hydroxide 2g/L) ସ୍ପ୍ରେ କରନ୍ତୁ।",
            "ରୋଗ ହୋଇଥିବା ତଳ ଡାଳପତ୍ରକୁ ତୁରନ୍ତ ଛିଣ୍ଡାଇ ନଷ୍ଟ କରନ୍ତୁ।"
        ],
        "chemical_treatment": [
            "Fixed copper combined with Mancozeb to enhance copper efficacy against resistant strains."
        ],
        "chemical_treatment_or": [
            "କପର ଅକ୍ସିକ୍ଲୋରାଇଡ୍ ସହିତ ଷ୍ଟ୍ରେପ୍ଟୋସାଇକ୍ଲିନ୍ (Streptocycline 1g in 10L water) ମିଶାଇ ସିଞ୍ଚନ କରନ୍ତୁ।"
        ]
    },
    "grape_black_rot": {
        "crop": "Grape (Vitis vinifera)",
        "crop_or": "ଅଙ୍ଗୁର (Grape)",
        "crop_hi": "अंगूर (Grape)",
        "condition": "Black Rot",
        "condition_or": "ଅଙ୍ଗୁରର କଳା ପଚା ରୋଗ (Black Rot)",
        "condition_hi": "अंगूर का काला सड़न रोग (Black Rot)",
        "pathogen": "Guignardia bidwellii (Fungus)",
        "pathogen_or": "ଗିଗ୍ନାର୍ଡିଆ ବିଡୱେଲି (ଫିମ୍ପି)",
        "pathogen_hi": "गुइग्लार्डिया बिडवेली",
        "severity": "High",
        "severity_or": "ଅଧିକ",
        "severity_hi": "अधिक",
        "farmer_explanation_or": "ଏହି ଫିମ୍ପି ଯୋଗୁଁ ଅଙ୍ଗୁର ପତ୍ରରେ ଲାଲ୍-ମାଟିଆ ଦାଗ ହୁଏ ଏବଂ ଫଳ ଗୁଡ଼ିକ ଶୁଖି କୁଞ୍ଚୁକୁଞ୍ଚିଆ ହୋଇ କଳା କାଠି ଭଳି ନଷ୍ଟ ହୋଇଯାଏ।",
        "symptoms": [
            "Small reddish-brown circular spots on leaves with tiny black fruiting bodies",
            "Berries shrivel into hard, black, wrinkled mummies",
            "Sunken black lesions on canes and petioles"
        ],
        "symptoms_or": [
            "ପତ୍ର ଉପରେ ଲାଲ୍-ମାଟିଆ ଗୋଲାକାର ଦାଗ ଏବଂ ଦାଗ ମଝିରେ କଳା ବିନ୍ଦୁ ଦେଖାଯିବା।",
            "ଅଙ୍ଗୁର ଫଳ ଶୁଖି, କୁଞ୍ଚୁକୁଞ୍ଚିଆ ହୋଇ ଟାଣ କଳା ଗୋଲି ଭଳି ହୋଇଯିବା।",
            "ଡାଳ ଉପରେ କଳା ଗାତ ଭଳି ଦାଗ ହେବା।"
        ],
        "causes": "Warm, wet weather in spring and early summer.",
        "causes_or": "ଉଷୁମ ଓ କ୍ରମାଗତ ବର୍ଷା ପାଗରେ ଏହି ରୋଗ ଦ୍ରୁତ ଗତିରେ ବ୍ୟାପେ।",
        "prevention": [
            "Remove and destroy all mummified grapes and infected cane prunings during winter dormancy.",
            "Maintain trellis canopy management for optimal ventilation."
        ],
        "prevention_or": [
            "ଶୀତଦିନେ ଗଛରେ ଲାଗି ରହିଥିବା ଶୁଖିଲା ପଚା ଅଙ୍ଗୁର ଏବଂ ରୋଗା ଡାଳ କାଟି ନଷ୍ଟ କରନ୍ତୁ।",
            "ଅଙ୍ଗୁର ଲଟାକୁ ଉପରକୁ ଉଠାଇ ତାରରେ ଭଲ ଭାବରେ ବାନ୍ଧନ୍ତୁ ଯାହାଦ୍ୱାରା ତଳେ ପବନ ଓ ଖରା ଲାଗିବ।"
        ],
        "organic_treatment": [
            "Copper soap or wettable sulfur applied starting from early bud break.",
            "Bio-pesticide applications every 7-14 days."
        ],
        "organic_treatment_or": [
            "ନୂଆ ପତ୍ର ଆସିବା ବେଳୁ ଗନ୍ଧକ ଗୁଣ୍ଡ (Wettable Sulfur 2g/L) କିମ୍ବା ତମ୍ବାଯୁକ୍ତ ସ୍ପ୍ରେ କରନ୍ତୁ।",
            "ଜୈବିକ ଫିମ୍ପିନାଶକ ସ୍ପ୍ରେ କରନ୍ତୁ।"
        ],
        "chemical_treatment": [
            "Myclobutanil, Tebuconazole, or Captan starting at 1-3 inch shoot growth."
        ],
        "chemical_treatment_or": [
            "ଟେବୁକୋନାଜୋଲ୍ (Tebuconazole) କିମ୍ବା ମାଇକ୍ଲୋବୁଟାନିଲ୍ ଔଷଧ ନିୟମିତ ବ୍ୟବଧାନରେ ସିଞ୍ଚନ କରନ୍ତୁ।"
        ]
    },
    "healthy_leaf": {
        "crop": "Plant Leaf",
        "crop_or": "ଉଦ୍ଭିଦ ପତ୍ର (Crop Leaf)",
        "crop_hi": "पादप पत्ती (Crop Leaf)",
        "condition": "Healthy Plant Tissue",
        "condition_or": "ସୁସ୍ଥ ଓ ନିରୋଗ ଫସଲ (Healthy Crop)",
        "condition_hi": "स्वस्थ एवं नीरोग पौधा (Healthy Crop)",
        "pathogen": "None detected",
        "pathogen_or": "କୌଣସି ରୋଗଜୀବାଣୁ ନାହିଁ",
        "pathogen_hi": "कोई रोगज़नक़ नहीं",
        "severity": "None",
        "severity_or": "କିଛି ନାହିଁ",
        "severity_hi": "कोई नहीं",
        "farmer_explanation_or": "ଆପଣଙ୍କ ଫସଲର ପତ୍ରଟି ସମ୍ପୂର୍ଣ୍ଣ ସୁସ୍ଥ, ସତେଜ ଏବଂ ସବୁଜ ଅଛି। ଏଥିରେ କୌଣସି ରୋଗ ବା ପୋକ ଖାଇବାର ଚିହ୍ନ ନାହିଁ।",
        "symptoms": [
            "Vibrant, uniform green coloration without necrotic or chlorotic lesions",
            "Intact cuticle and leaf margins without premature wilting",
            "Normal turgidity and leaf texture"
        ],
        "symptoms_or": [
            "ପତ୍ରଟି ସମ୍ପୂର୍ଣ୍ଣ ସବୁଜ ଓ ଚିକ୍‌ମିକ୍ କରୁଛି, କୌଣସି କଳା ବା ହଳଦିଆ ଦାଗ ନାହିଁ।",
            "ପତ୍ରର ଧାର ଅକ୍ଷୁର୍ଣ୍ଣ ଅଛି ଏବଂ ପତ୍ରରେ କୌଣସି କଣା ନାହିଁ।",
            "ପତ୍ରଟି ସତେଜ ଓ ଟାଣ ଅଛି, କୌଣସି ଝାଉଁଳିବା ଲକ୍ଷଣ ନାହିଁ।"
        ],
        "causes": "Proper balance of sunlight, soil moisture, balanced nutrition, and pest protection.",
        "causes_or": "ଉପଯୁକ୍ତ ସୂର୍ଯ୍ୟାଲୋକ, ସନ୍ତୁଳିତ ଖତ-ସାର ଏବଂ ଠିକ୍ ପରିମାଣରେ ପାଣି ପାଇଥିବାରୁ ଗଛଟି ସୁସ୍ଥ ଅଛି।",
        "prevention": [
            "Continue routine balanced fertilization (NPK + micronutrients).",
            "Maintain regular watering schedule at soil level.",
            "Periodically inspect undersides of leaves for early insect or fungal signs."
        ],
        "prevention_or": [
            "ସୁଷମ ଖତ ଓ ସାର (ଯଥା: ଗୋବର ଖତ, ନାଇଟ୍ରୋଜେନ୍, ଫସଫରସ୍, ପୋଟାସ୍) ନିୟମିତ ପ୍ରୟୋଗ ଜାରି ରଖନ୍ତୁ।",
            "ଗଛ ମୂଳରେ ନିୟମିତ ଭାବେ ଆବଶ୍ୟକ ମୁତାବକ ପାଣି ଦିଅନ୍ତୁ।",
            "ସପ୍ତାହରେ ଥରେ ପତ୍ର ତଳ ଯାଞ୍ଚ କରନ୍ତୁ ଯେପରି ପ୍ରାରମ୍ଭରୁ ପୋକ ବା ରୋଗ ନ ଲାଗିବ।"
        ],
        "organic_treatment": [
            "No disease treatment required.",
            "Optional preventive neem foliar spray or compost tea for general immune support."
        ],
        "organic_treatment_or": [
            "କୌଣସି ରୋଗ ଔଷଧ ଆବଶ୍ୟକ ନାହିଁ।",
            "ଗଛକୁ ଆହୁରି ମଜବୁତ ରଖିବା ପାଇଁ ୧୫ ଦିନରେ ଥରେ ଜୀବାମୃତ କିମ୍ବା ହାଲୁକା ନିମ୍ବ ଅର୍କ ସ୍ପ୍ରେ କରିପାରିବେ।"
        ],
        "chemical_treatment": [
            "None required."
        ],
        "chemical_treatment_or": [
            "କୌଣସି ରାସାୟନିକ ବିଷ ସିଞ୍ଚନ ଆବଶ୍ୟକ ନାହିଁ।"
        ]
    }
}
