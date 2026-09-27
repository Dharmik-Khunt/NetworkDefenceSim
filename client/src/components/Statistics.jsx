function Statistics() {

  const statistics = [
    {
      title: "Devices",
      value: 12,
      description: "Network devices"
    },
    {
      title: "Traffic Events",
      value: "4,281",
      description: "Last 24 hours"
    },
    {
      title: "Active Alerts",
      value: 8,
      description: "Require investigation"
    },
    {
      title: "Incidents",
      value: 2,
      description: "Currently active"
    }
  ];

  return (
    <section className="stats">

      {statistics.map((stat) => (

        <div className="stat-card" key={stat.title}>

          <p>{stat.title}</p>

          <h2>{stat.value}</h2>

          <span>{stat.description}</span>

        </div>

      ))}

    </section>
  );
}

export default Statistics;