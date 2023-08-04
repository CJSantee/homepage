import Footer from "../../components/Footer";
import Header from "../../components/Header";

function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-between vh-100">
        <Header />
        <div className="d-flex flex-column align-items-center justify-content-center">
          <span className="threed">404</span>
          <h3 className="text-uppercase">Page Not Found</h3>
        </div>
        <Footer />
    </div>
  )
}

export default NotFound;