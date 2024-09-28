import React from 'react'

const NavBarItem = ({ title, classProps }:{title:string,classProps?:string}) => (
    <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>
  );
  


export default NavBarItem
