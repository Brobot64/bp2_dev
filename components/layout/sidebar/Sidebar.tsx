"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import style from "./page.module.css";
import { FaChevronDown, FaChevronRight, FaTachometerAlt, FaUsers, FaBook, FaEllipsisH } from "react-icons/fa";
import { useAuth } from "../../../app/context/AuthProvider";

const Sidebar: React.FC = () => {
  const { loggedUser } = useAuth();
  const pathname = usePathname();
  const [menuOpen1, setMenuOpen1] = useState(true);
  const [menuOpen2, setMenuOpen2] = useState(true);
  const [menuOpen3, setMenuOpen3] = useState(true);
  const [menuOpen4, setMenuOpen4] = useState(true);
  const [menuOpen5, setMenuOpen5] = useState(true);

  const toggleMenu1 = () => {
    setMenuOpen1(!menuOpen1);
  };

  const toggleMenu2 = () => {
    setMenuOpen2(!menuOpen2);
  };

  const toggleMenu3 = () => {
    setMenuOpen3(!menuOpen3);
  };

  const toggleMenu4 = () => {
    setMenuOpen4(!menuOpen4);
  };

  const toggleMenu5 = () => {
    setMenuOpen5(!menuOpen5);
  };

  return (
    <div className={`h-screen w-64 ${style.sidebar}`}>
      <h1 className={` ${style.blackColor} ${style.logo} `}>
        <img
          src="/logo-cube-transparent-bck.png"
          alt="Image 2"
          className="no-fade"
        />{" "}
        <span>
          BLVCK<span className={style.italics}>PIXEL</span>
        </span>
      </h1>

      <nav>
        <Link className={style.item} href="/dashboard" legacyBehavior>
          <a className={`${ pathname === "/dashboard" ? style.active : ""} ${style.item}`}>
          <FaTachometerAlt className={style.catIcon} /> Dashboard
          </a>
        </Link>
        <div className={style.category}>
          <button className="w-full" onClick={toggleMenu1}>
          <FaUsers className={style.catIcon} /> User Management {menuOpen1 ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {menuOpen1 && (
            <div className={style.items}>
            {loggedUser?.role_id !== 2 && (
              <Link href="/dashboard/create-user" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/create-user" ? style.active : ""
                  } w-full`}
                >
                  Create User
                </a>
              </Link>
            )}
              <Link href="/dashboard/manage-users" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/manage-users" ? style.active : ""
                  } w-full`}
                >
                  Manage Users
                </a>
              </Link>
              {loggedUser?.role_id !== 2 && (
              <Link href="/dashboard/subscriptions" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/subscriptions" ? style.active : ""
                  } w-full`}
                >
                  Manage Subscriptions
                </a>
              </Link>
              )}
            </div>
          )}
        </div>
        
        {loggedUser?.role_id !== 2 && (
        <div className={style.category}>
          <button className="w-full" onClick={toggleMenu2}>
            <FaBook className={style.catIcon} /> Blvckbox {menuOpen2 ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {menuOpen2 && (
            <div className={style.items}>
               
              <Link href="/dashboard/blvckbox" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/blvckbox" ? style.active : ""
                  } w-full`}
                >
                  Manage
                </a>
              </Link>
              <Link href="/dashboard/blvckbox/create" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/blvckbox/create" ? style.active : ""
                  } w-full`}
                >
                  Create
                </a>
              </Link>
            </div>
          )}
        </div>
)}

        {loggedUser?.role_id !== 2 && (

        <div className={style.category}>
          <button className="w-full" onClick={toggleMenu3}>
            <FaBook className={style.catIcon} /> ContentCards {menuOpen3 ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {menuOpen3 && (
            <div className={style.items}>
             
              <Link href="/dashboard/contentcards" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/contentcards" ? style.active : ""
                  } w-full`}
                >
                  Manage
                </a>
              </Link>
              <Link href="/dashboard/contentcards/create" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/contentcards/create" ? style.active : ""
                  } w-full`}
                >
                  Create
                </a>
              </Link>
              
            </div>
          )}
        </div>
)}

        <div className={style.category}>
          <button className="w-full" onClick={toggleMenu4}>
            <FaBook className={style.catIcon} /> Blvckcards {menuOpen4 ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {menuOpen4 && (
            <div className={style.items}>
              <Link href="/dashboard/blvckcards" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/blvckcards" ? style.active : ""
                  } w-full`}
                >
                  Manage
                </a>
              </Link>
              <Link href="/dashboard/blvckcards/create" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/blvckcards/create" ? style.active : ""
                  } w-full`}
                >
                  Create
                </a>
              </Link>
              
            </div>
          )}
        </div>


        <div className={style.category}>
          <button className="w-full" onClick={toggleMenu5}>
            <FaEllipsisH className={style.catIcon} /> More {menuOpen5 ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {menuOpen5 && (
            <div className={style.items}>
              <Link href="/dashboard/settings" legacyBehavior>
                <a
                  className={`${
                    pathname === "/dashboard/settings" ? style.active : ""
                  } w-full`}
                >
                   Settings
                </a>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
