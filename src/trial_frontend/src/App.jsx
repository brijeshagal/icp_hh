import { ethers } from "ethers";
import { useState } from "react";
import HelloAbi from "../public/abi.json";
// canister id: vsr4k-oyaaa-aaaah-aq23a-cai
// Sepolia address: 0xFC9074F7360D8C8ca4688d0AC9dCf982C3459aa2
function App() {
  const [greeting, setGreeting] = useState("");
  const [submittedNames, setSubmittedNames] = useState([]);

  async function handleSubmit() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xFC9074F7360D8C8ca4688d0AC9dCf982C3459aa2",
        HelloAbi,
        signer
      );
      const res = await contract.greet(greeting);
      await res.wait();
      getSubmittedNames();
    } catch (e) {
      console.log({ e });
    }
  }

  async function getSubmittedNames() {
    // const provider = new ethers.BrowserProvider(window.ethereum);
    const provider = new ethers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io");
    // const signer = await provider.getSigner();
    // console.log("Account:", await signer.getAddress());
    const contract = new ethers.Contract(
      "0xFC9074F7360D8C8ca4688d0AC9dCf982C3459aa2",
      HelloAbi,
      provider
    );
    const res = await contract.getSubmittedNames();
    setSubmittedNames(res);
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form action="#">
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input
          onChange={(e) => setGreeting(e.target.value)}
          id="name"
          alt="Name"
          type="text"
          value={greeting}
        />
        <button
          onClick={(event) => {
            handleSubmit(event);
          }}
          type="button"
        >
          Click Me!
        </button>
      </form>
      <button onClick={getSubmittedNames} style={{ marginTop: "10px" }}>
        View submitted names
      </button>
      <div>
        {submittedNames.map((name) => {
          return <div key={name}>{name}</div>;
        })}
      </div>
    </main>
  );
}

export default App;
