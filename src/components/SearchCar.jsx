import { useState, useEffect } from "react";
import UserIcon from "./../assets/fi_users.png";
import CalenderIcon from "./../assets/fi_calendar.png";
import SettingsIcon from "./../assets/fi_settings.png";

const SearchCar = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [driverType, setDriverType] = useState("default");
  const [date, setDate] = useState("");
  const [pickupTime, setPickupTime] = useState("false");
  const [passengerCount, setPassengerCount] = useState(0);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [noCarsAvailable, setNoCarsAvailable] = useState(false); // State for no cars available

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/fnurhidayat/probable-garbanzo/main/data/cars.min.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cars data");
        }
        const data = await response.json();
        setCars(data);
        setFilteredCars(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading cars:", error);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleFilter = () => {
    setLoading(true); // Set loading to true when filter starts

    setTimeout(() => {
      let filtered = [...cars];

      // Filter based on driver type
      if (driverType !== "default") {
        filtered = filtered.filter((car) =>
          driverType === "true" ? car.available : !car.available
        );
      }

      // Filter based on date
      if (date !== "") {
        filtered = filtered.filter(
          (car) =>
            new Date(car.availableAt).toDateString() ===
            new Date(date).toDateString()
        );
      }

      // Filter based on pickup time
      if (pickupTime !== "false") {
        filtered = filtered.filter((car) => car.options.includes(pickupTime));
      }

      // Filter based on passenger count
      if (passengerCount > 0) {
        filtered = filtered.filter((car) => car.capacity >= passengerCount);
      }

      setFilteredCars(filtered);
      setLoading(false);

      if (filtered.length === 0) {
        setNoCarsAvailable(true);
      } else {
        setNoCarsAvailable(false);
      }
    }, 500);
  };

  return (
    // Filter
    <div>
      <section className="search-car">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12">
              <div className="row search-card mx-lg-5 py-3 px-4">
                <div className="col-lg-auto col-xl-2 col-xxl-3 col-md-auto">
                  <label>Tipe Driver</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={driverType}
                    onChange={(e) => setDriverType(e.target.value)}
                  >
                    <option value="default">Pilih Tipe Driver</option>
                    <option value="true">Dengan Supir</option>
                    <option value="false">Tanpa Supir (Lepas Kunci)</option>
                  </select>
                </div>
                <div className="col-lg-auto col-xl-auto col-md-auto">
                  <label>Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Pilih Tanggal"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="col-lg-auto col-xl-auto col-md-auto search-time">
                  <label>Pilih Waktu</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  >
                    <option value="false">Pilih Waktu</option>
                    <option value="08:00">08.00 WIB</option>
                    <option value="09:00">09.00 WIB</option>
                    <option value="10:00">10.00 WIB</option>
                    <option value="11:00">11.00 WIB</option>
                    <option value="12:00">12.00 WIB</option>
                  </select>
                </div>
                <div className="col-lg-auto col-xl-auto col-md-auto">
                  <label className="fw-light">
                    Jumlah Penumpang (optional)
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control border-end-0"
                      placeholder="Jumlah Penumpang"
                      value={passengerCount}
                      onChange={(e) =>
                        setPassengerCount(parseInt(e.target.value))
                      }
                    />
                    <span className="input-group-text bg-white">
                      <img src={UserIcon} width="20px" alt="" />
                    </span>
                  </div>
                </div>
                <div className="col-lg-2 col-xl-auto col-md-2 pt-4">
                  <button className="btn btn-utama" onClick={handleFilter}>
                    Cari Mobil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* List Cars */}
      <section className="cars">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="row" id="cars-container">
                {loading ? (
                  // Loading indicator
                  <div className="text-center">Loading...</div>
                ) : noCarsAvailable ? (
                  // No cars available message
                  <div className="text-center">No cars available</div>
                ) : (
                  // Show cars
                  filteredCars.map((car) => (
                    <div className="card px-2 py-4" key={car.id}>
                      <img
                        src={`/src/assets/${car.image}`}
                        className="card-img-top mt-4"
                        alt="Car Image"
                      />
                      <div className="card-body">
                        <h5 className="card-title fs-6">{`${car.manufacture}/${car.model}`}</h5>
                        <h5 className="card-title fs-5 fw-bold">
                          Rp {car.rentPerDay} / hari
                        </h5>
                        <p className="cars__p">{car.description}</p>
                        <div>
                          <p className="">
                            <img src={UserIcon} width="20px" alt="Users Icon" />
                            <span className="ps-2">{car.capacity} Orang</span>
                          </p>
                          <p className="">
                            <img
                              src={SettingsIcon}
                              width="20px"
                              alt="Settings Icon"
                            />
                            <span className="ps-2">{car.transmission}</span>
                          </p>
                          <p className="">
                            <img
                              src={CalenderIcon}
                              width="20px"
                              alt="Calendar Icon"
                            />
                            <span className="ps-2">Tahun {car.year}</span>
                          </p>
                        </div>
                        <a
                          href="#"
                          className="btn btn-utama"
                          style={{ width: "100%" }}
                        >
                          Go somewhere
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchCar;
