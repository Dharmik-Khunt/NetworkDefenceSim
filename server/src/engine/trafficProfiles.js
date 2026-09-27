const trafficProfiles = [

  {
    name: "Web Browsing",

    sources: [
      "10.0.0.101",
      "10.0.0.102"
    ],

    destinations: [
      "10.0.0.10"
    ],

    service: "HTTPS",

    protocol: "TCP",

    port: 443
  },

  {
    name: "DNS Query",

    sources: [
      "10.0.0.101",
      "10.0.0.102",
      "10.0.0.10"
    ],

    destinations: [
      "10.0.0.53"
    ],

    service: "DNS",

    protocol: "UDP",

    port: 53
  },

  {
    name: "Database Access",

    sources: [
      "10.0.0.10"
    ],

    destinations: [
      "10.0.0.20"
    ],

    service: "Database",

    protocol: "TCP",

    port: 3306
  },

  {
    name: "VPN Traffic",

    sources: [
      "10.0.0.30"
    ],

    destinations: [
      "10.0.0.10"
    ],

    service: "HTTPS",

    protocol: "TCP",

    port: 443
  }

];

module.exports = trafficProfiles;