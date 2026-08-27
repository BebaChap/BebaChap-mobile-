const fs = require('fs');
const path = require('path');

// Ramani ya maandishi ya zamani -> key ya t()
const MAP = {
  'Mgawanyo wa Watumiaji': "t('user_breakdown')",
  'Wateja': "t('customers')",
  'Madereva': "t('drivers')",
  'Maduka': "t('vendors')",
  'Gereji': "t('garages')",
  'Pangilia Bei za Safari (Live)': "t('pricing_live')",
  'Badilisha hapa, mteja ataona bei mpya moja kwa moja': "t('pricing_desc')",
  'Wanaosubiri Approval': "t('pending_approval')",
  'Malalamiko Wazi': "t('open_disputes')",
  'Pata Usafiri Haraka!': "t('get_ride_fast')",
  'Dereva wa karibu ndani ya dakika 3': "t('driver_near_3min')",
  'Karibu Dukani': "t('welcome_shop')",
  'Spare 5 ziko umbali wa 1.2km - OPEN': "t('spare_open')",
  'Tembelea Maduka': "t('visit_shops')",
  'Fundi wa Karibu': "t('nearby_fundi')",
  'Pata huduma ya uhakika - 0.8km': "t('fundi_desc')",
  'Pata Fundi': "t('get_fundi')",
  'Migahawa ya Karibu 🍔': "t('nearby_restaurant')",
  'Chakula kitamu - 0.5km - Inawaka': "t('food_desc')",
  'Angalia Menu': "t('view_menu')",
  'Ona Huduma': "t('see_services')",
  'Ficha ▼': "t('hide_text')",
  'Ficha': "t('hide')",
  'Habari,': "t('hello'),",
  'Tabata, Dar es Salaam': "t('current_location')",
  'Unaenda wapi?': "t('where_are_you_going')",
  'Tafuta spare...': "t('search_spare')",
  'Tafuta fundi...': "t('search_fundi')",
  'Tafuta chakula...': "t('search_food')",
  'Badili Lugha': "t('change_language')",
  'Badilisha Role': "t('change_role')",
  'Admin App': "t('admin_app')",
  'Driver App': "t('driver_app')",
  'Vendor App': "t('vendor_app')",
  'Customer App': "t('customer_app')",
  'Toka': "t('logout')",
  'Futa Akaunti': "t('delete_account')",
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // 1. Hakikisha ina useLanguage
  if (!content.includes('useLanguage') && content.includes('<Text')) {
    content = content.replace(
      /from ['"]\.\.\/\.\.\/contexts\/AuthContext['"];/,
      `from '../../contexts/AuthContext';\nimport { useLanguage } from '../../contexts/LanguageContext';`
    );
    content = content.replace(/const \{[^}]*\} = useAuth\(\);/, (m) => m + `\n  const { t } = useLanguage();`);
  }

  // 2. Badilisha maandishi
  for (let [oldText, newCode] of Object.entries(MAP)) {
    // >Maandishi<
    content = content.split(`>${oldText}<`).join(`>{${newCode}}<`);
    // : 'Maandishi' fallback
    content = content.split(`: '${oldText}'`).join(`: ${newCode}`);
    content = content.split(`? '${oldText}'`).join(`? ${newCode}`);
  }

  // 3. Ondoa pattern ya t? t('x') : 'y'
  content = content.replace(/\{t\? t\('([^']+)'\) : '[^']+'\}/g, `{t('$1')}`);

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.js')) fixFile(p);
  });
}

walk('./src/screens');
walk('./src/components');
console.log('\nIMEKAMILIKA! Run tena command yako ya PowerShell ku-check.');