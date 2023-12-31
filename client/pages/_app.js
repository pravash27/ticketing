import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import Header from '../components/header'
const AppComponent = ({Component,pageProps,currentUser}) =>{
    return <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} currentUser={currentUser}/>
    </div>
        
}

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx)
    const { data } = await client.get('/api/users/currentuser')

    return {
        ...data
    }
}

export default AppComponent