import React, { useEffect, useState, useRef } from "react";
import Photo from "./photo";
import { FaSearch } from "react-icons/fa";

import "./App.css";
///////////////////////
//const key = `LVzy8fbRmVS1nxvQCtdhqMkMQ7eLxHifTl0GKtP_MFs`;
// tomke the key safe from other when its live wu use env veriable
//secret key = `t7glFQO0aWAscI6oq4xhnQTmxNpX2In_ikGpnX0MU5I`
const key = process.env.REACT_APP_ACCESS_KEY;
const get = `https://api.unsplash.com`;
const addToUrl = `?client_id=`;
const mailUrl = `${get}/photos/`;
const searchUrl = `${get}/search/photos`;

/////////////////////////////////
function App() {
  ///////////////////hooks//////////////////////
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState([]); //to set list of photo we are geting back from api
  // fetching the data (random photos fro home page)

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [newImages, setNewImages] = useState(false); // dekho kya atha abhi tak ki scroll karne pe feching hone lagti thi jahe wo fist fetching se data aaya ho ya na
  const movement = useRef(false); // dekho use ref ek bar hi render hota h to isse hum scroll ko controll karenge
  ///////////////////////
  const fetchData = async () => {
    setLoading(true); //as soon as fetching is start loading will also start

    const urlPage = `&page=${page}`; // page value 1 hogi to api 10 photo dega 2 hogi to agli 10 photo dega
    const URLTOHIT = `${mailUrl}${addToUrl}${key}${urlPage}`;
    const URLFORSEARCH = `${searchUrl}${addToUrl}${key}${urlPage}&query=${search}`;

    const url = !search ? URLTOHIT : URLFORSEARCH;

    try {
      const respons = await fetch(url);
      if (!respons.ok) throw new Error(); //for error
      const data = await respons.json();

      // setPhoto(data);// yaha ab data use ni kar sjte kyuki jese jese page ki value badegi data over right hone lagega
      // setPhoto((oldphoto) => { //(oldPhoto) me photo ki value hoti h
      //   return [...oldphoto, ...data];
      // });
      //pure kocomment is liye karna pada kyu ki search karen ke bad jo data aara h uska for mate laga ek object ke andar search result
      setPhoto((oldPhoto) => {
        if (search && page === 1) {
          return [...data.results];
        }

        if (search) {
          return [...oldPhoto, ...data.results]; //par bhi data aato jaega lekin display ni hoga kyuki purana data to hataya hi ni humne
        } else {
          return [...oldPhoto, ...data];
        }
      });
      setNewImages(false); //taki jab ek bar data fatch ho jae to fir se ye false ho jae  (ye code ka main role event function ke bad hi h par iski position bahut zaruri h ki setLoading ke pehle ho)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setLoading(false);

      alert(error.message);
    }
  };
  ////////////functions////////////
  const hadndleSubmit = (e) => {
    e.preventDefault();
    //setPage(1); //kyuki manlo humne starting me scroll karke pageki value 1 se jada kar di to next search pe pehleni aaega search result is liye jab bhi search pe click hoga page ki value 1 ho jaeto absahi sekam karega
    // fetchData(); //jese hi submit pe clik ho data fetch ho
    // kyu useeffect page pe render ho raha h to ab fetch function ko use karne ki zarurat nahi h
    //////////////
    // dekho kuch search kar rahe to pageki value 1 nahi h aur wo search nahi alr rah  is liye
    if (!search) return; // yadi  koi khali search bar pe click kare to api hit naho
    if (page === 1) {
      fetchData();
    }
    setPage(1);
  };

  const handlaeChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const event = () => {
    const innerHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const pageHeight = document.body.scrollHeight;
    // if (innerHeight + scrollY >= pageHeight) {
    //   //dekho abhi kyahora h malo abhi apna data fetch ho rah he aur hum scroll
    //   // kare to fir data fetch joga isse bachle ke liye hum check karenge loading ko
    //   fetchData();
    // }

    if (!loading && innerHeight + scrollY >= pageHeight - 10) {
      //ab jab tak loading false nahi hogi aage fetch nahi karga
      setNewImages(true); //taki jab page ke end pe pahuche to pata chal jae
    }
  };
  //////////using useEffect ////////////

  useEffect(() => {
    //fist time data fetch k liye
    fetchData(); // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    //ye is liye taki yadi loading ho ho jae tabhi data etch ho warna na ho
    if (!movement.current) {
      movement.current = true;
      return;
    }
    if (!newImages) return; //tabhi kam kare jab hum us point pe ho jab fetch karne ki jarurat h
    if (loading) return; //agar loding ho rahi h to kuch mat kar
    setPage((oldPage) => {
      return oldPage + 1;
    });
  }, [newImages]);

  useEffect(() => {
    //scroll ki fuctionality
    window.addEventListener("scroll", event);
    return () => window.removeEventListener("scroll", event); // eslint-disable-next-line
  }, []);
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={search}
            onChange={handlaeChange}
          />
          <button className="submit-btn" type="submit" onClick={hadndleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photo.map((image, index) => {
            return <Photo key={index} {...image}></Photo>;
          })}
        </div>
        {loading && <h3 className="loading">loading...</h3>}
      </section>
    </main>
  );
}

export default App;
