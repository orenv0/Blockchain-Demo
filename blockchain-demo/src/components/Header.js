import React from 'react'
import { Link } from 'react-router-dom'

function Header() {

    return (
        <div className='OptionsBackground'>
            <div className='Options'>
                <Link className='MainMenuLinks' to='/'>Hash</Link>
                <Link className='MainMenuLinks' to='/block'>Block</Link>
                <Link className='MainMenuLinks' to='/blockchain'>Blockchain</Link>
                <Link className='MainMenuLinks' to='/distributed'>Distributed</Link>
                <Link className='MainMenuLinks' to='/tokens'>Tokens</Link>
                <Link className='MainMenuLinks' to='/coinbase'>Coinbase</Link>
                <Link className='MainMenuLinks' to='/keys'>Keys</Link>
                <Link className='MainMenuLinks' to='/signatures'>Signatures</Link>
                <Link className='MainMenuLinks' to='/transaction'>Transaction</Link>
                <Link className='MainMenuLinks' to='/fatBlockchain'>Fat Blockchain</Link>
            </div>
        </div>
    )
}
export default Header
