import { useState } from "react";
import logo from "./assets/logo.svg";
import "./App.css";
import firebase from "./firebase";
import {
  collection,
  getFirestore,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

function App() {
  const first_class = [1, 2, 3, 4, 5, 6, 7];
  const [count, setCount] = useState(0);
  const [gc, setGC] = useState("");
  const db = getFirestore(firebase);
  const [clsc, setClsc] = useState<Array<string>[]>([]);
  async function getClick(db: any, grade: number) {
    const clickCol = collection(db, "click");
    const clickSnap = await getDocs(clickCol);
    const clickData = clickSnap.docs.map((doc) => doc.data());
    return clickData[grade - 1];
  }
  function resetCheck() {
    const day = new Date();
    getClick(db, 4).then((r) => {
      if (day.getMonth() !== r.month) {
        getClick(db, 1).then((r) => {
          let cr = r;
          for (var i in cr) {
            cr[i] = 0;
          }
          setDoc(doc(db, "click", "grade1"), cr);
          setDoc(doc(db, "click", "month"), { month: day.getMonth() });
        });
      }
    });
  }
  resetCheck();
  function clickHandler() {
    if (gc !== "") {
      setCount(count + 1);
      getClick(db, Number(gc.slice(0, 1))).then((r) => {
        let cr = r;
        cr[gc] = count + 1;
        setDoc(doc(db, "click", `grade${gc.slice(0, 1)}`), cr);
      });
    }
  }
  function changeHandler(e: any) {
    setGC(e.target.value);
    getClick(db, Number(e.target.value.slice(0, 1))).then((r) => {
      setCount(r[e.target.value]);
    });
  }
  return (
    <div className="flex select-none flex-col">
      <button
        className="bg-slate-200 dark:bg-slate-700"
        onClick={() => {
          document.querySelector("#desc")?.classList.toggle("hidden");
        }}
      >
        플레이 방법
      </button>
      <p id="desc" className="text-center hidden">
        온산중학교 로고를 클릭해주세요!<br></br>
        제작: 1703 고태경<br></br>
        Special Not Thanks: ★송재영★
      </p>
      <div>
        <select
          onChange={changeHandler}
          className="bg-white dark:bg-stone-700 text-2xl"
        >
          <option value="">반을 선택해 주세요</option>
          {first_class.map((d, i) => {
            return <option key={i} value={`1${d}`}>{`1학년 ${d}반`}</option>;
          })}
        </select>
        <p id="counter" className="text-center text-5xl">
          {count}
        </p>
      </div>
      <div className="flex space-y-2 flex-col justify-center items-center">
        <label>연타 박스(키보드 입력)</label>
        <input
          className="border-black border-2"
          onKeyDown={clickHandler}
          onChange={(e) => (e.target.value = "")}
        ></input>
      </div>
      <div className="flex mt-20 justify-center items-center">
        <img onClick={clickHandler} src={logo}></img>
      </div>
      <div
        id="modal"
        className="bg-white text-black shadow-lg rounded-lg duration-200 fixed top-[95vh] h-full w-full"
      >
        <p
          onClick={() => {
            const modal = document.querySelector("#modal");
            modal?.classList.toggle("top-[50vh]");
            modal?.classList.toggle("top-[95vh]");
            getClick(db, 1).then((r) => {
              const res = Object.entries(r)
                .sort(([, a], [, b]) => a - b)
                .reverse();

              setClsc(res);
            });
          }}
          className="text-lg text-center cursor-pointer border-2 w-full"
        >
          △ 순위 ▽
        </p>
        <ul className="pl-2 list-none divide-gray-400 divide-y">
          {clsc.map((v, i) => (
            <li className="text-lg" key={i}>{`${i + 1}위 ${v[0].slice(
              0,
              1
            )}학년 ${v[0].slice(1)}반 : ${v[1]}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
