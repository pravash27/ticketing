import Link from "next/link"

export default ({currentUser}) => {
    const links = [
        currentUser && {label: 'Sign Out', link: '/signout'},
        !currentUser && {label: 'Sign In', link: '/signin'},
        !currentUser && {label: 'Sign Up', link: '/signup'}
    ]
    .filter(linkConfig => linkConfig)
    .map(link => <li key={link.label}><Link className="nav-link" href={link.link}>{link.label}</Link></li>)
    return <nav className="navbar navbar-light bg-light">
        <Link className="navbar-brand" href='/'>
            GitTix
        </Link>
        <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">
                {links}
            </ul>
        </div>
    </nav>
}