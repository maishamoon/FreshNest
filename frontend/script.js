// ─── DATA STORE ───────────────────────────────────────────────────────────────
const PRODUCE_DB = {
  // FRUITS
  'Mango':       { cat:'Fruit', emoji:'🥭', temp:'13–15°C', humidity:'85–90%', freshDays:14, tips:'Store away from ethylene-sensitive produce. Ripen at room temperature.', harvestMonths:'May–July' },
  'Banana':      { cat:'Fruit', emoji:'🍌', temp:'13–15°C', humidity:'85–95%', freshDays:7,  tips:'Never refrigerate unripe bananas. Keep dry and ventilated.', harvestMonths:'Year-round' },
  'Litchi':      { cat:'Fruit', emoji:'🍒', temp:'2–5°C',   humidity:'90–95%', freshDays:5,  tips:'Refrigerate immediately after harvest to retain red color.', harvestMonths:'May–June' },
  'Pineapple':   { cat:'Fruit', emoji:'🍍', temp:'7–10°C',  humidity:'85–90%', freshDays:10, tips:'Store upright. Do not stack. Avoid ethylene exposure.', harvestMonths:'Apr–Aug' },
  'Guava':       { cat:'Fruit', emoji:'🍈', temp:'8–10°C',  humidity:'85–90%', freshDays:7,  tips:'Wrap individually in tissue paper for longer shelf life.', harvestMonths:'Year-round' },
  'Papaya':      { cat:'Fruit', emoji:'🍈', temp:'10–13°C', humidity:'85–90%', freshDays:7,  tips:'Harvest at 25% yellow for long-distance transport.', harvestMonths:'Year-round' },
  'Jackfruit':   { cat:'Fruit', emoji:'🟡', temp:'11–14°C', humidity:'85–90%', freshDays:5,  tips:'Cut jackfruit must be refrigerated and consumed within 3 days.', harvestMonths:'Jun–Aug' },
  'Watermelon':  { cat:'Fruit', emoji:'🍉', temp:'10–15°C', humidity:'85–90%', freshDays:14, tips:'Store away from other fruits. Do not refrigerate uncut.', harvestMonths:'Apr–Sep' },
  'Coconut':     { cat:'Fruit', emoji:'🥥', temp:'0–2°C',   humidity:'80–85%', freshDays:30, tips:'Remove husks for longer cold storage. Avoid moisture.', harvestMonths:'Year-round' },
  'Orange':      { cat:'Fruit', emoji:'🍊', temp:'3–9°C',   humidity:'85–90%', freshDays:21, tips:'Check regularly for mold. Do not wash before storage.', harvestMonths:'Nov–Feb' },
  'Strawberry':  { cat:'Fruit', emoji:'🍓', temp:'0–2°C',   humidity:'90–95%', freshDays:5,  tips:'Handle with extreme care. Never wash before storage.', harvestMonths:'Dec–Feb' },
  'Grape':       { cat:'Fruit', emoji:'🍇', temp:'0–2°C',   humidity:'90–95%', freshDays:21, tips:'Store in original clusters. Avoid temperature fluctuation.', harvestMonths:'Dec–Mar' },
   // VEGETABLES
  'Tomato':      { cat:'Vegetable', emoji:'🍅', temp:'10–13°C', humidity:'85–90%', freshDays:10, tips:'Store stem-up. Never refrigerate fully ripe tomatoes.', harvestMonths:'Oct–Mar' },
  'Potato':      { cat:'Vegetable', emoji:'🥔', temp:'4–7°C',  humidity:'85–90%', freshDays:60, tips:'Store in dark, dry, cool place. Avoid light to prevent greening.', harvestMonths:'Jan–Mar' },