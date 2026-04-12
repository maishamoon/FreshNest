const ROLE_CFG = {
  farmer:    { color:'#27AE60', bg:'#1E8449', icon:'🌾', navItems: [
    { id:'dashboard', label:'Dashboard',          icon:'📊' },
    { id:'products',  label:'My Produce',         icon:'🌿' },
    { id:'transport', label:'Transport Requests',  icon:'🚛' },
    { id:'deals',     label:'My Deals',            icon:'🤝' },
    { id:'storage',   label:'Storage Guide',       icon:'📦' },
  ]},

  transport: { color:'#E67E22', bg:'#CA6F1E', icon:'🚛', navItems: [
    { id:'dashboard', label:'Dashboard',           icon:'📊' },
    { id:'offers',    label:'Browse Requests',     icon:'📋' },
    { id:'myjobs',    label:'My Jobs',             icon:'🗓️' },
    { id:'failures',  label:'Report Failure',      icon:'⚠️' },
  ]},

  dealer:    { color:'#2471A3', bg:'#1A5276', icon:'🏪', navItems: [
    { id:'dashboard', label:'Dashboard',           icon:'📊' },
    { id:'browse',    label:'Browse Produce',      icon:'🛒' },
    { id:'mydeals',   label:'My Deals',            icon:'🤝' },
  ]},

  admin:     { color:'#8E44AD', bg:'#6C3483', icon:'⚙️', navItems: [
    { id:'dashboard', label:'Overview',            icon:'📊' },
    { id:'users',     label:'All Users',           icon:'👥' },
    { id:'products',  label:'All Produce',         icon:'🌿' },
    { id:'transport', label:'Transport',           icon:'🚛' },
    { id:'deals',     label:'Deals',               icon:'🤝' },
    { id:'failures',  label:'Failures',            icon:'⚠️' },
  ]},
};
