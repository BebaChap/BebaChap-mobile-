const fs = require('fs'); const path = require('path');
const MAP = {
  "Admin Dashboard":"admin_dashboard","Muhtasari wa Mfumo":"system_summary","Watumiaji Wote":"all_users",
  "Mapato Jumla":"total_income","Oda Zote":"all_orders","Safari Zote":"all_trips",
  "Mgawanyo wa Watumiaji":"user_distribution","Wateja":"customers","Madereva":"drivers",
  "Maduka":"shops","Gereji":"garages","Wanaosubiri Approval":"waiting_approval",
  "Malalamiko Wazi":"open_complaints","Idhinisha Watumiaji":"approve_users","Kataa":"reject",
  "✓ Idhinisha":"approve","Malalamiko":"complaints","Shughulikia Lalamiko":"handle_complaint",
  "Mteja:":"customer","Suala:":"issue","Maelezo:":"details","Suluhisho:":"solution",
  "Ghairi":"cancel","✓ Shughulikia":"handle","Sahau Nenosiri":"forgot_pass",
  "Weka namba yako tutakutumia OTP":"enter_number_otp","Tuma OTP":"send_otp",
  "Weka OTP":"enter_otp","Thibitisha":"verify","Msaada & Support":"help_support",
  "❓ Maswali ya Kawaida":"faq","💬 WhatsApp Support":"whatsapp_support","🐛 Ripoti Tatizo":"report_issue",
  "Chagua Lugha / Choose Language":"choose_lang","Endelea / Continue":"continue_lang",
  "Inatafuta eneo lako...":"searching_location","Karibu BEBACHAP":"welcome_bebachap",
  "Chagua huduma unayohitaji karibu nawe":"choose_service","Duka la karibu":"nearby_shop",
  "Spare 5 ziko umbali wa 1.2km":"spare_nearby","OPEN":"open","Endelea":"next",
  "Notifications":"notifications","Dereva":"driver","Muuzaji":"vendor","Toka":"logout",
  "Settings":"settings","🌍 Badili Lugha":"change_language","🔔 Notifications":"notifications_setting",
  "🔒 Badili Nenosiri":"change_password","👑 Admin App":"admin_app","🚗 Driver App":"driver_app",
  "🏪 Vendor App":"vendor_app","🛍 Customer App":"customer_app","🚪 Logout":"logout",
  "🗑 Futa Akaunti":"logout","Share App":"share_app","Kosa: Hakuna huduma iliyochaguliwa":"no_service_selected",
  "Hifadhi Huduma":"save_service","Chagua Muda":"choose_time","Kikapu Changu":"my_cart","Lipa Sasa":"pay_now",
  "Malipo":"payment","Anwani ya Delivery":"delivery_address","Muhtasari wa Oda":"order_summary",
  "Jumla ya Chakula":"food_total","Nauli":"delivery_fee","Jumla":"total","Njia ya Malipo":"payment_method",
  "Lipa Cash kwa Dereva":"pay_cash_driver","Jina linalotokea":"appearing_name","Pochi (TZS 50,000)":"wallet",
  "Maelekezo (Si lazima)":"instructions","Huduma za Gereji":"garage_services","Ona Huduma":"view_services",
  "Ficha ▼":"hide","Pata Usafiri Haraka!":"fast_transport","Dereva wa karibu ndani ya dakika 3":"driver_near_3min",
  "Request Ride":"request_ride","Karibu Dukani":"welcome_shop","Tembelea Maduka":"visit_shops",
  "Fundi wa Karibu":"nearby_mechanic","Pata Fundi":"get_mechanic","Migahawa ya Karibu 🍔":"nearby_restaurants",
  "Angalia Menu":"view_menu","▲ Ona Maelezo":"view_details","Dereva Anakuja":"driver_coming",
  "Bidhaa haijapatikana":"product_not_found","🛒 Ongeza Kikapuni":"add_to_cart",
  "Agiza Usafiri":"order_transport","Chagua usafiri unaopenda":"choose_transport",
  "Unatoka wapi?":"where_from","Unaenda wapi?":"where_to","Chagua gari 🛺":"choose_car",
  "Dereva aliyechaguliwa":"selected_driver","Online":"online","Lipa kwa 💳":"pay_with","Migahawa":"restaurants",
  "Duka":"shop_service","Safari Zangu":"my_trips","Huna safari yoyote bado":"no_trips","Salio Lako":"your_balance",
  "+ Ongeza Pesa":"add_money","Miamala":"transactions","Hakuna miamala bado":"no_transactions",
  "Hakuna safari":"no_trip","🗺 Unaendesha":"you_are_driving","Safari Inaendelea":"trip_ongoing",
  "Umbali":"distance","Muda":"time","Pakia Nyaraka":"upload_docs",
  "Tunahitaji nyaraka hizi kuthibitisha akaunti yako":"need_docs","Leseni ya Udereva":"driving_license",
  "Bima ya Gari":"car_insurance","Picha ya Gari":"car_photo","Wasilisha Nyaraka":"submit_docs",
  "Mapato Yangu":"my_earnings","Mapato":"earnings","💰 Toa Pesa":"withdraw",
  "Miamala ya Hivi Karibuni":"recent_transactions","Habari Dereva 👋":"hello_driver",
  "📜 Historia ya Safari":"trip_history","Uko Offline":"offline",
  "Washa \"Online\" kupokea request za safari":"go_online","Tunasaka Wateja...":"searching_customers",
  "Request zitakuja hapa":"requests_here","Kubali":"accept","Hakuna Request":"no_request",
  "🗺 Ramani":"map","Fungua Google Maps":"open_google_maps","Kuchukua:":"pickup","Kwenda:":"going_to",
  "Umbali:":"distance_label","Bei:":"price_label","📞 Piga Simu Mteja":"call_customer",
  "Bonyeza kuongeza picha":"tap_add_photo","Badilisha Picha":"change_photo","Bei (TSh)":"price_label",
  "Stock":"stock","Profile ya Duka":"shop_profile","Jina la Biashara":"shop_name","Eneo":"area",
  "Saa za Kazi":"working_hours","Namba ya Simu":"phone_number_label","Hifadhi Mabadiliko":"save_changes",
  "Duka Langu 📊":"my_shop","Mauzo Leo":"todays_sales","Oda Leo":"todays_orders","Rating":"rating",
  "Ona Zote →":"view_all","Ongeza Bidhaa":"add_product","Hariri Duka":"edit_shop","Kubali Oda":"accept_order",
  "Imetumwa":"sent","Imefikishwa":"delivered","Anza Kuandaa 🍳":"start_cooking",
  "Chakula Tayari ✅":"food_ready","Mpe Dereva 🛵":"give_driver"
};
function walk(d){let r=[];for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory()){if(!p.includes('node_modules'))r=r.concat(walk(p))}else if(p.endsWith('.js'))r.push(p)}return r;}
let c=0; walk('./src').forEach(file=>{
  let content=fs.readFileSync(file,'utf8'); let orig=content;
  for(const [sw,k] of Object.entries(MAP)){
    const esc=sw.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const reg=new RegExp(`<Text([^>]*)>\\s*${esc}\\s*</Text>`,'g');
    if(reg.test(content)){ content=content.replace(reg, `<Text$1>{t('${k}')}</Text>`); c++; }
  }
  if(content!==orig){ fs.writeFileSync(file,content,'utf8'); console.log('Fixed: '+file); }
});
console.log('Done! Fixed '+c+' more texts');