import "../../App.css";

import { useState } from "react";
import Sidebar from "./Sidebar";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="header">
        {/* <div className="container"> */}
          <div className="header-content">
            <div className="logo">📖 Buku Tamu Online</div>

            <button className="menu-toggle" onClick={() => setOpen(true)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          {/* </div> */}
        </div>
      </header>
      <Sidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
