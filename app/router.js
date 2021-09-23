export default class Router {
  constructor(routeList, initRoute) {
    this._activeRoute = null
    this.routeList = routeList

    this._watchRouterUpdate()

    if(initRoute) 
      this.open({addToHistory: false, ...initRoute,})
    else
      this._loadSelectedLink()
  }

  get activeRoute() {
    return this._activeRoute;
  }

  set activeRoute(selectedRoute) {
    this._activeRoute = _utils.clone(selectedRoute)
    this._appendRout(selectedRoute)
  }

  open({name, link, addToHistory = true}) {
    const activeRoute = name ? this._findRouteByName(name) : this._findRouteByLink(link)

    if(!activeRoute) {
      this._show404()
      return
    }

    if (addToHistory)
      history.pushState(null, null, activeRoute.link)
    else
      history.replaceState(null, null, activeRoute.link)

    this.activeRoute = activeRoute
  }

  _loadSelectedLink() {
    const locationLink = new URL(location.href).pathname;
    this.open({ link: locationLink, addToHistory: false })
  }

  _show404() {
    this.open({ name: '404', addToHistory: false })
  }

  _appendRout(selectedRoute) {
    const appSelector = document.querySelector('#app')
    const titleSelector = document.querySelector('title')

    titleSelector.innerHTML = selectedRoute.title
    try {
      const page = require(`./${selectedRoute.path}/page.html`).default
      appSelector.innerHTML = page
    } catch(err) {
      this._show404()
    }
  }

  _findRouteByName(routeName) {
    return this.routeList.find(route => route.name === routeName)
  }

  _findRouteByLink(routeLink) {
    return this.routeList.find(route => route.link === routeLink)
  }

  _watchRouterUpdate() {
    window.addEventListener('popstate', (e) => {
      e.preventDefault()
      this._loadSelectedLink()
    });
  }
}