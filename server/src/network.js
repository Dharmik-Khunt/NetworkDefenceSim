const devices = [
  {
    id: "firewall",
    name: "Firewall",
    ip: "10.0.0.1",
    type: "firewall"
  },

  {
    id: "web-01",
    name: "Web Server",
    ip: "10.0.0.10",
    type: "server"
  },

  {
    id: "db-01",
    name: "Database",
    ip: "10.0.0.20",
    type: "database"
  },

  {
    id: "vpn-01",
    name: "VPN Server",
    ip: "10.0.0.30",
    type: "vpn"
  },

  {
    id: "dns-01",
    name: "DNS Server",
    ip: "10.0.0.53",
    type: "dns"
  },

  {
    id: "pc-01",
    name: "Employee PC 01",
    ip: "10.0.0.101",
    type: "workstation"
  },

  {
    id: "pc-02",
    name: "Employee PC 02",
    ip: "10.0.0.102",
    type: "workstation"
  }
];

module.exports = devices;