import Footer from "../../components/Footer";

function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center vh-100">
      <div className="d-flex flex-column align-items-center justify-content-center">
        <span className="threed">404</span>
        <h3 className="text-uppercase">Page Not Found</h3>
      </div>
      <Footer sticky />
    </div>
  )
}

export default NotFound;