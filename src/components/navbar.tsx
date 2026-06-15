const Navbar = () => {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <nav className="navbar navbar-expand-lg blur border-radius-sm top-0 z-index-3 shadow position-sticky py-3 start-0 end-0">
      <div className="container px-1">
        <a className="navbar-brand font-weight-bolder ms-lg-0 " href={baseUrl}>Astro Ecommerce</a>
        <button className="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon mt-2">
            <span className="navbar-toggler-bar bar1"></span>
            <span className="navbar-toggler-bar bar2"></span>
            <span className="navbar-toggler-bar bar3"></span>
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navigation">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link text-dark font-weight-bold d-flex align-items-center me-2 " aria-current="page" href={baseUrl}>
                All Components
              </a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link text-dark dropdown-toggle font-weight-bold d-flex align-items-center me-2 " aria-current="page" id="pagesExample" data-bs-toggle="dropdown" aria-expanded="false">
                Pages <i className="bi bi-chevron-down ms-1"></i>
              </a>
              <ul className="dropdown-menu" aria-labelledby="pagesExample">
                <li><a className="dropdown-item" href={`${baseUrl}landing/`}>Landing Page</a></li>
                <li><a className="dropdown-item" href={`${baseUrl}product/`}>Product Page</a></li>
                <li><a className="dropdown-item" href={`${baseUrl}shopping-cart/`}>Shopping Cart</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark font-weight-bold d-flex align-items-center me-2 " aria-current="page" href="https://deploy.workers.cloudflare.com/?url=https://github.com/rainco2008/astro-ecommerce" target="_blank" rel="noreferrer">
                Deploy
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark font-weight-bold d-flex align-items-center me-2 " aria-current="page" href="https://github.com/rainco2008/astro-ecommerce">
                <i className="fab text-lg fa-github"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark font-weight-bold d-flex align-items-center me-2 " aria-current="page" href="https://discord.com/invite/TGZqBvZB" rel="nofollow" target="_blank">
                <i className="fab text-lg fa-discord"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
