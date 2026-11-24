import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import DataTable from './components/DataTable.jsx'
import Property from './components/Property.tsx'
import './App.css'

const stats = [
  { label: 'Monthly revenue', value: '$48,217', delta: '12.5%', direction: 'up', icon: 'fa-dollar-sign', color: 'c1', chart: 'kpi-revenue' },
  { label: 'Active leases', value: '284', delta: '8.2%', direction: 'up', icon: 'fa-file-contract', color: 'c2', chart: 'kpi-orders' },
  { label: 'Occupied units', value: '92.4%', delta: '2.1%', direction: 'up', icon: 'fa-building', color: 'c3', chart: 'kpi-users' },
  { label: 'Open requests', value: '38', delta: '3.2%', direction: 'down', icon: 'fa-wrench', color: 'c4', chart: 'kpi-conversion' },
]

const tasks = [
  ['Review lease renewal', 'High', 'Today'],
  ['Inspect Riverside unit', 'Medium', 'Tomorrow'],
  ['Approve vendor invoice', 'Low', 'Thursday'],
  ['Update tenant directory', 'Medium', 'Next week'],
]

const properties = [
  { id: 'PL-001', propertyCode: 'PL-001', name: 'Riverside Apartments', city: 'Austin', postalCode: '78701' },
  { id: 'PL-002', propertyCode: 'PL-002', name: 'Oak View', city: 'Dallas', postalCode: '75201' },
  { id: 'PL-003', propertyCode: 'PL-003', name: 'Central Plaza', city: 'Houston', postalCode: '77002' },
]

const propertyColumns = [
  { accessor: 'name', header: 'Property' },
  { accessor: 'propertyCode', header: 'Code' },
  { accessor: 'city', header: 'City' },
  { accessor: 'postalCode', header: 'Postal code' },
]

function DashboardHome() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Property dashboard</h1>
          <p className="subtitle">Here’s what’s happening across your portfolio today.</p>
        </div>
        <div className="page-header__actions">
          <button type="button" className="date-chip">
            <i className="fa-regular fa-calendar"></i> Last 30 days
            <i className="fa-solid fa-chevron-down"></i>
          </button>
          <button type="button" className="m-btn m-btn--ghost" id="dash-refresh-btn">
            <i className="fa-solid fa-arrows-rotate"></i> Refresh
          </button>
          <button type="button" className="m-btn m-btn--primary">
            <i className="fa-solid fa-plus"></i> Add property
          </button>
        </div>
      </div>
      <div className="row row-tight">
        {stats.map((stat) => (
          <div className="col-sm-6 col-lg-3" key={stat.label}>
            <article className="stat-card">
              <div className="stat-card__head">
                <p className="stat-card__label">{stat.label}</p>
                <span className={`stat-card__icon stat-card__icon--${stat.color}`}>
                  <i className={`fa-solid ${stat.icon}`} aria-hidden="true"></i>
                </span>
              </div>
              <p className="stat-card__value">{stat.value}</p>
              <p className={`stat-card__delta stat-card__delta--${stat.direction}`}>
                <i className={`fa-solid fa-arrow-${stat.direction}`} aria-hidden="true"></i>
                {stat.delta} <span className="stat-card__delta-period">vs last 30d</span>
              </p>
              <div className="stat-card__sparkline"><canvas id={stat.chart}></canvas></div>
            </article>
          </div>
        ))}
      </div>
      <div className="row row-tight" style={{ marginTop: 16 }}>
        <div className="col-lg-8">
          <section className="m-card primary-chart-card" aria-labelledby="revenue-title" data-skeletonize>
            <header className="m-card__header">
              <div>
                <h2 className="m-card__title" id="revenue-title">Revenue trend</h2>
                <p className="m-card__subtitle">Rental income over the past 30 days.</p>
              </div>
              <button type="button" className="m-btn m-btn--ghost" aria-label="More options">
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </header>
            <div style={{ height: 280, position: 'relative' }}><canvas id="primary-chart"></canvas></div>
          </section>
        </div>
        <div className="col-lg-4">
          <section className="m-card" aria-labelledby="activity-title">
            <header className="m-card__header">
              <div>
                <h2 className="m-card__title" id="activity-title">Recent activity</h2>
                <p className="m-card__subtitle">Latest property updates.</p>
              </div>
            </header>
            <ul className="activity-list">
              {[
                ['avatar-06.jpg', 'Cynthia Harvey', 'renewed lease at', 'Riverside Apartments', '2 hours ago'],
                ['avatar-04.jpg', 'Diane Myers', 'submitted a payment for', 'Unit 304', '5 hours ago'],
                ['avatar-01.jpg', 'John Doe', 'completed inspection at', 'Oak View', 'Yesterday'],
              ].map(([avatar, name, action, subject, time]) => (
                <li className="activity-item" key={name}>
                  <img className="activity-item__avatar" src={`/images/icon/${avatar}`} alt="" />
                  <div className="activity-item__body">
                    <p className="activity-item__text"><b>{name}</b> {action} <b>{subject}</b>.</p>
                    <span className="activity-item__time">{time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <div className="row row-tight" style={{ marginTop: 16 }}>
        <div className="col-lg-6">
          <section className="m-card" aria-labelledby="tasks-title">
            <header className="m-card__header">
              <div>
                <h2 className="m-card__title" id="tasks-title">My tasks</h2>
                <p className="m-card__subtitle">4 open tasks.</p>
              </div>
              <button type="button" className="m-btn m-btn--ghost" style={{ height: 30, padding: '0 10px' }}>
                <i className="fa-solid fa-plus"></i> Add task
              </button>
            </header>
            <ul className="task-list">
              {tasks.map(([title, priority, due], index) => (
                <li className="task-item" key={title}>
                  <input type="checkbox" id={`task-${index}`} />
                  <label className="task-item__title" htmlFor={`task-${index}`}>{title}</label>
                  <div className="task-item__meta">
                    <span className={`priority-chip priority-chip--${priority.toLowerCase()}`}>{priority}</span>
                    <span>{due}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="col-12">
          <section className="m-card" aria-labelledby="properties-title">
            <header className="m-card__header">
              <div>
                <h2 className="m-card__title" id="properties-title">Properties</h2>
                <p className="m-card__subtitle">Search and sort your property portfolio.</p>
              </div>
            </header>
            <DataTable
              columns={propertyColumns}
              data={properties}
              emptyMessage="No properties match your search."
              rowKey="id"
              searchPlaceholder="Search properties..."
            />
          </section>
        </div>
      </div>
    </>
  )
}

function RoutePage({ title, description }) {
  return (
    <section className="m-card" aria-labelledby="route-page-title">
      <header className="m-card__header">
        <div>
          <h1 className="m-card__title" id="route-page-title">{title}</h1>
          <p className="m-card__subtitle">{description}</p>
        </div>
      </header>
    </section>
  )
}

const navigation = [
  {
    label: 'Dashboard',
    path: '/',
    icon: 'fa-gauge-high',
    element: <DashboardHome />,
  },
  {
    label: 'Properties',
    path: '/properties',
    icon: 'fa-building',
    description: 'Manage property records and units.',
    
    children: [
      { label: 'All Properties', path: '/properties/list', description: 'View and manage your property portfolio.', element: <Property />, },
      { label: 'Units', path: '/properties/units', description: 'Manage units across your properties.' },
    ],
  },
  {
    label: 'Tenants',
    path: '/tenants',
    icon: 'fa-users',
    description: 'Manage tenant records and applications.',
    children: [
      { label: 'Tenant Directory', path: '/tenants/directory', description: 'View and manage tenant records.' },
      { label: 'Applications', path: '/tenants/applications', description: 'Review prospective tenant applications.' },
    ],
  },
  {
    label: 'Leases',
    path: '/leases',
    icon: 'fa-file-contract',
    description: 'Manage lease agreements and renewals.',
    children: [
      { label: 'Agreements', path: '/leases/agreements', description: 'View current and past lease agreements.' },
      { label: 'Renewals', path: '/leases/renewals', description: 'Review upcoming lease renewals.' },
    ],
  },
  {
    label: 'Maintenance',
    path: '/maintenance',
    icon: 'fa-screwdriver-wrench',
    description: 'Track maintenance requests and work orders.',
    children: [
      { label: 'Requests', path: '/maintenance/requests', description: 'Review property maintenance requests.' },
      { label: 'Work Orders', path: '/maintenance/work-orders', description: 'Manage scheduled and active work orders.' },
    ],
  },
  {
    label: 'Payments',
    path: '/payments',
    icon: 'fa-receipt',
    description: 'Review payments and invoices.',
    children: [
      { label: 'Transactions', path: '/payments/transactions', description: 'View rent payments and transaction history.' },
      { label: 'Invoices', path: '/payments/invoices', description: 'Review property invoices.' },
    ],
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: 'fa-chart-line',
    description: 'Review portfolio and financial reports.',
    children: [
      { label: 'Portfolio Overview', path: '/reports/portfolio', description: 'Review portfolio performance.' },
      { label: 'Financial Reports', path: '/reports/financial', description: 'Review income and expense summaries.' },
    ],
  },
]

const routeItems = navigation.flatMap((item) => [
  {
    path: item.path,
    element: item.element ?? <RoutePage title={item.label} description={item.description} />,
  },
  ...(item.children ?? []).map((child) => ({
    path: child.path,
    element: child.element ?? <RoutePage title={child.label} description={child.description} />,
  })),
])

function Dashboard() {
  const { pathname } = useLocation()

  useEffect(() => {
    const sources = [
      '/js/vanilla-utils.js',
      '/vendor/bootstrap-5.3.8.bundle.min.js',
      '/vendor/chartjs/chart.umd.js-4.5.1.min.js',
      '/js/bootstrap5-init.js',
      '/js/main-vanilla.js',
      '/js/modern-plugins.js',
    ]

    sources.reduce((previous, source) => previous.then(() => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${source}"]`)) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = source
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })), Promise.resolve()).catch((error) => {
      console.error('Failed to load CoolAdmin script', error)
    })
  }, [])

  return (
    <div className="page-wrapper">
      <aside className="menu-sidebar" id="main-sidebar">
        <div className="logo">
          <Link className="logo-link" to="/" aria-label="Pro Lease home">
            <span className="logo-mark" aria-hidden="true">P</span>
            <span className="logo-text">Pro Lease</span>
          </Link>
          <button className="sidebar-close js-sidebar-toggle" type="button" aria-label="Close navigation">
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <div className="menu-sidebar__content js-scrollbar1">
          <nav className="navbar-sidebar" aria-label="Main navigation">
            <ul className="list-unstyled navbar__list">
              {navigation.map((item) => {
                const hasChildren = Boolean(item.children?.length)
                const isActive = pathname === item.path
                  || item.children?.some((child) => pathname === child.path)

                return (
                  <li className={`${isActive ? 'active open ' : ''}${hasChildren ? 'has-sub' : ''}`.trim()} key={item.path}>
                    <Link
                      className={isActive && hasChildren ? 'open' : undefined}
                      to={item.path}
                      aria-expanded={hasChildren ? isActive : undefined}
                      aria-current={!hasChildren && isActive ? 'page' : undefined}
                    >
                      <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>{item.label}
                    </Link>
                    {hasChildren && (
                      <ul
                        className="list-unstyled navbar__sub-list js-sub-list"
                        style={isActive ? { display: 'block' } : undefined}
                      >
                        {item.children.map((child) => {
                          const childActive = pathname === child.path
                          return (
                            <li className={childActive ? 'active' : ''} key={child.path}>
                              <Link to={child.path} aria-current={childActive ? 'page' : undefined}>
                                {child.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="page-container">
        <header className="header-desktop">
          <div className="section__content section__content--p30">
            <div className="container-fluid">
              <div className="header-wrap">
                <button className="sidebar-toggle js-sidebar-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-sidebar">
                  <i className="fa-solid fa-bars" aria-hidden="true"></i>
                </button>
                <form className="form-header" role="search" onSubmit={(event) => event.preventDefault()}>
                  <i className="fa-solid fa-magnifying-glass form-header__icon" aria-hidden="true"></i>
                  <input className="au-input au-input--xl" type="search" placeholder="Search properties, tenants…" aria-label="Search" />
                </form>
                <div className="account-wrap">
                  <button className="account-item" type="button" aria-label="Open account menu">
                    <div className="image img-cir img-40"><img src="/images/icon/avatar-01.jpg" alt="" /></div>
                    <span>John Doe</span>
                    <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="main-content" id="main-content">
          <div className="section__content section__content--p30">
            <div className="container-fluid">
              <Routes>
                {routeItems.map((route) => (
                  <Route element={route.element} key={route.path} path={route.path} />
                ))}
                <Route element={<Navigate to="/" replace />} path="*" />
              </Routes>
            </div>
          </div>
        </main>
      </div>
      <div className="sidebar-backdrop js-sidebar-toggle" aria-hidden="true"></div>
    </div>
  )
}

export default Dashboard
