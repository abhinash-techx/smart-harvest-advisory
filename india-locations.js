// India state/district data loader.
// The dataset is generated from the Government of India's IGOD district directory.
// Source project: KTBsomen/Indian-state-district-json (MIT), sourced from igod.gov.in.
const INDIA_STATES = [
"Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
"Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
"Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
"Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
"Uttar Pradesh","Uttarakhand","West Bengal"
];

const INDIA_DISTRICTS_FALLBACK = {
"Andhra Pradesh":["Alluri Sitharama Raju","Anakapalli","Ananthapuramu","Annamayya","Bapatla","Chittoor","Dr. B. R. Ambedkar Konaseema","East Godavari","Eluru","Guntur","Kakinada","Krishna","Kurnool","Nandyal","NTR","Palnadu","Parvathipuram Manyam","Prakasam","Sri Potti Sriramulu Nellore","Srikakulam","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],
"Arunachal Pradesh":["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Itanagar Capital Complex","Kamle","Kra Daadi","Kurung Kumey","Lepa Rada","Lohit","Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai","Pakke Kessang","Papum Pare","Shi Yomi","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang"],
"Assam":["Baksa","Bajali","Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tamulpur","Tinsukia","Udalguri","West Karbi Anglong"],
"Bihar":["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Madhepura","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
"Chhattisgarh":["Balod","Baloda Bazar","Balrampur-Ramanujganj","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Gaurela-Pendra-Marwahi","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Khairagarh-Chhuikhadan-Gandai","Kondagaon","Korba","Korea","Mahasamund","Manendragarh-Chirmiri-Bharatpur","Mohla-Manpur-Ambagarh Chowki","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sakti","Sarangarh-Bilaigarh","Sukma","Surajpur","Surguja"],
"Goa":["North Goa","South Goa"],
"Gujarat":["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
"Haryana":["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
"Himachal Pradesh":["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
"Jharkhand":["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahibganj","Seraikela Kharsawan","Simdega","West Singhbhum"],
"Karnataka":["Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"],
"Kerala":["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
"Madhya Pradesh":["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Maihar","Mandla","Mandsaur","Mauganj","Morena","Narmadapuram","Narsinghpur","Neemuch","Niwari","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],
"Maharashtra":["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
"Manipur":["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
"Meghalaya":["East Garo Hills","East Jaintia Hills","East Khasi Hills","Eastern West Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
"Mizoram":["Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Saitual","Serchhip"],
"Nagaland":["Chumoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Niuland","Noklak","Peren","Phek","Shamator","Tuensang","Wokha","Zunheboto"],
"Odisha":["Angul","Boudh","Balangir","Bargarh","Balasore","Bhadrak","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Keonjhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh"],
"Punjab":["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Malerkotla","Mansa","Moga","Pathankot","Patiala","Rupnagar","Sahibzada Ajit Singh Nagar","Sangrur","Shahid Bhagat Singh Nagar","Sri Muktsar Sahib","Tarn Taran"],
"Rajasthan":["Ajmer","Alwar","Anupgarh","Balotra","Banswara","Baran","Barmer","Beawar","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Deeg","Dholpur","Didwana-Kuchamana","Dudu","Dungarpur","Ganganagar","Gangapur City","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Khairthal-Tijara","Kota","Kotputli-Behror","Nagaur","Neem Ka Thana","Pali","Phalodi","Pratapgarh","Rajsamand","Salumbar","Sawai Madhopur","Sikar","Sirohi","Sri Madhopur","Tonk","Udaipur"],
"Sikkim":["Gangtok","Gyalshing","Mangan","Namchi","Pakyong","Soreng"],
"Tamil Nadu":["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kancheepuram","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Kanniyakumari","Namakkal","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvarur","Vellore","Viluppuram","Virudhunagar","The Nilgiris"],
"Telangana":["Adilabad","Bhadradri Kothagudem","Hanamkonda","Hyderabad","Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Kumuram Bheem Asifabad","Mahabubabad","Mahbubnagar","Mancherial","Medak","Medchal-Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"],
"Tripura":["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
"Uttar Pradesh":["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
"Uttarakhand":["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],
"West Bengal":["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Maldah","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"]
};

window.INDIA_STATES = INDIA_STATES;
window.INDIA_LOCATIONS = INDIA_STATES.map(state=>({state,districts:INDIA_DISTRICTS_FALLBACK[state]||[]}));

// Try to refresh the district list from the latest open dataset.
// If it fails, the built-in fallback keeps the selector usable.
(async()=>{
  try{
    const r=await fetch("https://raw.githubusercontent.com/KTBsomen/Indian-state-district-json/main/india-states-districts-latest.json",{cache:"no-store"});
    if(!r.ok)return;
    const remote=await r.json();
    if(!Array.isArray(remote))return;
    const filtered=remote.filter(x=>INDIA_STATES.includes(x.state)&&Array.isArray(x.districts));
    if(filtered.length>=25){
      window.INDIA_LOCATIONS=INDIA_STATES.map(state=>{
        const item=filtered.find(x=>x.state===state);
        return {state,districts:item?.districts||INDIA_DISTRICTS_FALLBACK[state]||[]};
      });
      document.dispatchEvent(new CustomEvent("indiaLocationsUpdated"));
    }
  }catch(e){console.warn("Using built-in India district fallback.",e)}
})();
