function requestIAP(){
    
}

export const itemPriority = ["whale", "no_login", "free", "paid", "stuck", "coins", "skip"];

export const priceList = {
  "item01": {
    "name": "coins",
    "price": "38"
  },
  "item02": {
    "name": "skip",
    "price": "333"
  },
  "item03": {
    "name": "hammer",
    "price": "3750"
  },
  "item04": {
    "name": "shake",
    "price": "3750"
  },
  "item05": {
    "name": "brush",
    "price": "3750"
  },
  "item06": {
    "name": "rainbow",
    "price": "3750"
  }
}
export function getNextAvailableSubitems(headID) {
  const items = limitedOffer[headID];
  for (const itemKey in items) {
    const item = items[itemKey];

    if (item.collected === false) {
      item.collected = true;
      return {
        itemID: itemKey,
        subitems: item.subitems
      };
    }
  }
  return null;
}

export const limitedOffer = {
  "coins": {
    "item001": {
      "info": " Coins -- Coins < 100",
      "collected": true,
      "save": "13.33",
      "price": 6500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "200" }
      }
    },
    "item002": {
      "info": " After Coins 1",
      "collected": true,
      "save": "20.00",
      "price": 9000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "300" }
      }
    },
    "item003": {
      "info": " After Coins 2",
      "collected": false,
      "save": "27.62",
      "price": 9500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "350" }
      }
    },
     "item004": {
      "info": " After Coins 3",
      "collected": true,
      "save": "20.00",
      "price": 7500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "250" }
      }
    },
     "item005": {
      "info": " After Coins 4",
      "collected": true,
      "save": "16.00",
      "price": 10000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "320" }
      }
    },
  },
  "skip": {
    "item001": {
      "info": "Skip'its -- skip ≤ 1",
      "collected": true,
      "save": "10.00",
      "price": 1500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "5" }
      }
    },
    "item002": {
      "info": "After Skip 1",
      "collected": true,
      "save": "19.00",
      "price": 2700,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "10" }
      }
    },
    "item003": {
      "info": "After Skip 2",
      "collected": true,
      "save": "10.00",
      "price": 1200,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "4" }
      }
    },
    "item004": {
      "info": "After Skip 3",
      "collected": true,
      "save": "12.50",
      "price": 3500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "12" }
      }
    },
    "item005": {
      "info": "After Skip 4",
      "collected": true,
      "save": "20.00",
      "price": 4000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "15" }
      }
    },
  },
  "free": {
    "item001": {
      "info": "Conversion -- No Purchase 0 Days from Date Joined",
      "collected": true,
      "save": "36.47",
      "price": 4500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "100" },
        "sub002": { "name":"skip", "id": "1", "value": "10" }
      }
    },
    "item002": {
      "info": "No Purchase 2 Days from Date Joined",
      "collected": true,
      "save": "33.33",
      "price": 7500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"hammer", "id": "2", "value": "1" },
        "sub002": { "name":"shake", "id": "3", "value": "1" },
        "sub003": { "name":"brush", "id": "4", "value": "1" }
      }
    },
    "item003": {
      "info": "No Purchase 4 Days from Date Joined",
      "collected": false,
      "save": "38.06",
      "price": 8000,
      "countdown": 5000,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "5" },
        "sub002": { "name":"hammer", "id": "2", "value": "3" },
      }
    },
    "item004": {
      "info": "No Purchase 7 Days from Date Joined",
      "collected": true,
      "save": "40.63",
      "price": 9500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "100" },
        "sub002": { "name":"skip", "id": "1", "value": "3" },
        "sub002": { "name":"hammer", "id": "2", "value": "3" }
      }
    },
    "item005": {
      "info": "No Purchase 21 Days from Date Joined",
      "collected": true,
      "save": "32.39",
      "price": 10000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "50" },
        "sub002": { "name":"skip", "id": "1", "value": "5" },
        "sub003": { "name":"shake", "id": "3", "value": "3" },
      }
    },
  },
  "stuck": {
    "item001": {
      "info": "Boosters -- Fail a Level at Least 3 Times",
      "collected": false,
      "save": "33.33",
      "price": 5000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"hammer", "id": "2", "value": "2" }
      }
    },
    "item002": {
      "info": "After Stuck 1",
      "collected": true,
      "save": "36.67",
      "price": 9500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"hammer", "id": "2", "value": "2" },
        "sub002": { "name":"shake", "id": "3", "value": "2" }
      }
    },
    "item003": {
      "info": "After Stuck 2",
      "collected": true,
      "save": "36.00",
      "price": 12000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"hammer", "id": "2", "value": "5" }
      }
    },
    "item004": {
      "info": "After Stuck 3",
      "collected": true,
      "save": "35.25",
      "price": 15000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "2" },
        "sub002": { "name":"hammer", "id": "2", "value": "4" },
        "sub003": { "name":"shake", "id": "3", "value": "2" }
      }
    },
    "item005": {
      "info": "After Stuck 4",
      "collected": true,
      "save": "33.88",
      "price": 13500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "5" },
        "sub002": { "name":"shake", "id": "3", "value": "5" }
      }
    },
  },
  "paid": {
    "item001": {
      "info": "Variety -- 2 Days No Repurchase From Last Purchase Date",
      "collected": true,
      "save": "39.05",
      "price": 8000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "150" },
        "sub002": { "name":"hammer", "id": "2", "value": "1" },
        "sub003": { "name":"shake", "id": "3", "value": "1" }
      }
    },
    "item002": {
      "info": "4 Days No Repurchase From Last Purchase Date",
      "collected": true,
      "save": "34.86",
      "price": 9500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "100" },
        "sub002": { "name":"skip", "id": "1", "value": "10" },
        "sub003": { "name":"hammer", "id": "2", "value": "2" }
      }
    },
    "item003": {
      "info": "7 Days No Repurchase From Last Purchase Date",
      "collected": true,
      "save": "33.33",
      "price": 10000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"hammer", "id": "2", "value": "1" },
        "sub002": { "name":"shake", "id": "3", "value": "1" },
        "sub003": { "name":"brush", "id": "4", "value": "1" },
        "sub004": { "name":"rainbow", "id": "5", "value": "1" }
      }
    },
    "item004": {
      "info": "10 Days No Repurchase From Last Purchase Date",
      "collected": true,
      "save": "33.33",
      "price": 12500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "100" },
        "sub002": { "name":"hammer", "id": "2", "value": "2" },
        "sub003": { "name":"shake", "id": "3", "value": "2" }
      }
    },
    "item005": {
      "info": "14 Days No Repurchase From Last Purchase Date",
      "collected": true,
      "save": "41.94",
      "price": 15000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "10" },
        "sub002": { "name":"hammer", "id": "2", "value": "2" },
        "sub003": { "name":"shake", "id": "3", "value": "2" },
        "sub004": { "name":"brush", "id": "4", "value": "2" }
      }
    },
  },
  "no_login": {
    "item001": {
      "info": "Variety -- 2 Days No Login from Last Login",
      "collected": true,
      "save": "33.33",
      "price": 5000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "200" }
      }
    },
    "item002": {
      "info": "3 Days No Login from Last Login",
      "collected": true,
      "save": "30.77",
      "price": 7500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "200" },
        "sub002": { "name":"skip", "id": "1", "value": "10" }
      }
    },
    "item003": {
      "info": "5 Days No Login from Last Login",
      "collected": true,
      "save": "44.44",
      "price": 12500,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"hammer", "id": "2", "value": "2" },
        "sub002": { "name":"shake", "id": "3", "value": "2" },
        "sub003": { "name":"brush", "id": "4", "value": "2" }
      }
    },
    "item004": {
      "info": "7 Days No Login from Last Login",
      "collected": true,
      "save": "31.43",
      "price": 10000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"skip", "id": "1", "value": "10" },
        "sub002": { "name":"hammer", "id": "2", "value": "1" },
        "sub003": { "name":"brush", "id": "4", "value": "1" },
        "sub004": { "name":"rainbow", "id": "5", "value": "1" }
      }
    },
    "item005": {
      "info": "14 Days No Login from Last Login",
      "collected": true,
      "save": "42.56",
      "price": 14000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "50" },
        "sub002": { "name":"hammer", "id": "2", "value": "2" },
        "sub003": { "name":"shake", "id": "3", "value": "2" },
        "sub004": { "name":"brush", "id": "4", "value": "2" }
      }
    },
  },
  "whale": {
    "item001": {
      "info": "Great Deals -- Spend > Rp50.000 in 24 hours",
      "collected": true,
      "save": "48.28",
      "price": 25000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "200" },
        "sub002": { "name":"skip", "id": "1", "value": "10" },
        "sub003": { "name":"hammer", "id": "2", "value": "5" },
        "sub004": { "name":"shake", "id": "3", "value": "5" }
      }
    },
    "item002": {
      "info": "Spend > Rp60.000 in 24 hours",
      "collected": true,
      "save": "52.94",
      "price": 30000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "800" },
        "sub002": { "name":"shake", "id": "3", "value": "3" },
        "sub003": { "name":"brush", "id": "4", "value": "3" },
        "sub004": { "name":"rainbow", "id": "5", "value": "3" }
      }
    },
    "item003": {
      "info": "Spend > Rp70.000 in 24 hours",
      "collected": true,
      "save": "53.33",
      "price": 35000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "1000" },
        "sub002": { "name":"hammer", "id": "2", "value": "5" },
        "sub003": { "name":"shake", "id": "3", "value": "5" }
      }
    },
    "item004": {
      "info": "Spend > Rp80.000 in 24 hours",
      "collected": true,
      "save": "59.60",
      "price": 50000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "1800" },
        "sub002": { "name":"shake", "id": "3", "value": "5" },
        "sub003": { "name":"brush", "id": "4", "value": "5" },
        "sub004": { "name":"rainbow", "id": "5", "value": "5" }
      }
    },
    "item005": {
      "info": "Spend > Rp90.000 in 24 hours",
      "collected": true,
      "save": "60.70",
      "price": 75000,
      "countdown": 3600,
      "subitems": {
        "sub001": { "name":"coins", "id": "0", "value": "3000" },
        "sub002": { "name":"skip", "id": "1", "value": "10" },
        "sub003": { "name":"hammer", "id": "2", "value": "10" },
        "sub004": { "name":"shake", "id": "3", "value": "10" }
      }
    },
  }
}

export const shopItems = {
  "coins": {
    "item001":{
      "info": "",
      "tag": "",
      "price": 2550,
      "value": "80"
    },
    "item002":{
      "info": "",
      "tag": "",
      "price": 4250,
      "value": "150"
    },
    "item003":{
      "info": "",
      "tag": "Popular!",
      "price": 10200,
      "value": "400"
    },
    "item004":{
      "info": "",
      "tag": "",
      "price": 40800,
      "value": "1600"
    },
    "item005":{
      "info": "",
      "tag": "Best Value!",
      "price": 85000,
      "value": "3600"
    }
  },
  "skip": {
    "item001":{
      "info": "",
      "tag": "",
      "price": 850,
      "value": "3"
    },
    "item002":{
      "info": "",
      "tag": "",
      "price": 1700,
      "value": "6"
    },
    "item003":{
      "info": "",
      "tag": "",
      "price": 4250,
      "value": "15"
    },
    "item004":{
      "info": "",
      "tag": "Popular!",
      "price": 12750,
      "value": "50"
    },
    "item005":{
      "info": "",
      "tag": "",
      "price": 21250,
      "value": "100"
    },
    "item006":{
      "info": "",
      "tag": "Best Value!",
      "price": 29750,
      "value": "150"
    }
  }  
}



