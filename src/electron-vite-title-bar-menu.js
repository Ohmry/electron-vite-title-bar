// 해당 메뉴에 하위 메뉴가 존재할 때, 하위 메뉴가 있음을 표시하기 위한 아이콘의 SVG Path 값
const expandSubMenuSvgPath = 'M543.846-480.231 353.538-671.308l22.231-22.231 212.539 213.308-212.539 212.539-22.231-22.231 190.308-190.308Z'
// 루트 메뉴를 생성할 때, 메뉴의 너비가 부족하여 일부를 Collapse 했을 때, 표시하기 위한 아이콘의 SVG Path 값
const collapseMenuSvgPath = 'M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z'

class ElectronViteTitleBarMenu {
  constructor () {    
    this.container = undefined
    this.frameContainer = undefined
    this.titleContainer = undefined
    this.isMenuActivated = false
    this.emit = undefined
  }
  
  /**
   * 메뉴를 생성하기 위해 객체에 필요한 정보를 초기화한다.
   * @param {프레임 컨테이너} frameContainer 
   * @param {메뉴 컨테이너} container 
   * @param {타이틀 컨테이너} titleContainer 
   * @param {클릭 함수를 발생시킬 emitter} emitter 
   */
  initialize = (frameContainer, container, titleContainer, emitter) => {
    this.frameContainer = frameContainer
    this.container = container
    this.titleContainer = titleContainer
    this.emit = emitter
    // 메뉴의 외부를 클릭했을 때, 메뉴를 닫는 이벤트를 구성한다.
    this.addMenuDestoryListener()
  }

  /**
   * 메뉴 리스트 정보가 유효한지 검사한다.
   * @param {메뉴 리스트} menuList 
   */
  validateMenu = (menuList) => {
    if (!Array.isArray(menuList)) {
      throw TypeError('메뉴정보는 JSON 형태의 배열로 구성되어야 합니다.')
    }
    menuList.forEach(menuInfo => this.validateMenuInfo(menuInfo))
  }

  /**
   * 메뉴정보가 유효한지 검사한다.
   * @param {메뉴정보} menuInfo 
   */
  validateMenuInfo = (menuInfo) => {
    if (menuInfo.label == undefined && !menuInfo.seperator) {
      console.error(menuInfo)
      throw TypeError('메뉴정보는 { seperator: true } 또는 { label: \'메뉴이름\' } 값을 가져야합니다.')
    } else if (menuInfo.label != undefined && menuInfo.seperator) {
      console.error(menuInfo)
      throw TypeError('메뉴정보는 seperator와 label 값을 같이 가질 수 없습니다.')
    }
  
    if (menuInfo.seperator) return
    if (menuInfo.subMenu != undefined && menuInfo.click != undefined) {
      console.error(menuInfo)
      throw TypeError('메뉴정보는 click 값과 subMenu 값 중 하나만 설정할 수 있습니다.')
    } else if(menuInfo.hotKey != undefined && menuInfo.subMenu != undefined) {
      console.error(menuInfo)
      throw TypeError('메뉴정보는 단축키(hotkey)와 하위 메뉴정보 중 하나만 설정할 수 있습니다.')
    } else if (menuInfo.subMenu != undefined && !Array.isArray(menuInfo.subMenu)) {
      console.error(menuInfo)
      throw TypeError('하위 메뉴정보는 JSON 형태의 배열로 구성되어야 합니다.')
    }

    if (menuInfo.hotKey != undefined) {
      window.addEventListener('keydown', (e) => {
        const keys = menuInfo.hotKey.split('+')
        let hasCtrl = false
        let hasAlt = false
        let hasShift = false

        if (keys.includes('Ctrl')) {
          hasCtrl = true
          keys.splice(keys.indexOf('Ctrl'), 1)
        }
        if (keys.includes('Alt')) {
          hasAlt = true
          keys.splice(keys.indexOf('Alt'), 1)
        }
        if (keys.includes('Shift')) {
          hasShift = true
          keys.splice(keys.indexOf('Shift'), 1)
        }

        if (e.ctrlKey == hasCtrl && e.altKey == hasAlt && e.shiftKey == hasShift && e.key.toUpperCase() == keys[0].toUpperCase()) {
          e.preventDefault()
          console.log(menuInfo.label)
        }
      })
    }
  
    // 각 하위메뉴를 재귀형태로 호출하여 유효성을 검사한다.
    if (menuInfo.subMenu != undefined) {
      menuInfo.subMenu.forEach(subMenuInfo => this.validateMenuInfo(subMenuInfo))
    }
  }
  /**
   * 최상단의 메뉴정보를 생성한다.
   * @param {메뉴정보} menuList 
   */
  createRootMenu = (menuList) => {
    const rootGroup = this.container.querySelector('ul.evtb-menu-group[level="0"]')
    if (rootGroup != null) {
      rootGroup.remove()
    }
    const group = this.createMenuGroup(0)
    this.container.appendChild(group)

    let index = 0;
    if (this.frameContainer.getBoundingClientRect().width > 480) {
      for (index; index < menuList.length; index++) {
        const menuItem = this.createMenuItem(0, menuList[index])
        group.appendChild(menuItem)
  
        // 메뉴를 생성하다가 메뉴 컨테이너의 우측 변과 타이틀의 좌측 변이 겹치는 경우
        if (this.container.getBoundingClientRect().width + this.container.getBoundingClientRect().x >= this.titleContainer.getBoundingClientRect().x - 20) {
          // 남은 메뉴들은 최소화 메뉴에 담기 위해서
          // 최소화 메뉴를 넣을 공간을 만들어야하므로 마지막 노드를 삭제한다.
          group.removeChild(menuItem)
          if (group.hasChildNodes()) {
            group.removeChild(group.lastChild)
          }
          index--
          break;
        }
      }
    }

    // 메뉴를 만들 때, 모든 메뉴가 만들어지지 않은 경우
    // (메뉴를 생성하다가 메뉴 컨테이너의 우측 변과 타이틀의 좌측 변이 겹치는 경우)
    if (index != menuList.length) {
      // 최소화 메뉴 버튼을 생성한다.
      const collapseElement = document.createElement('li')
      collapseElement.setAttribute('type', 'menu')
      collapseElement.classList.add('evtb-menu-item-0')
      collapseElement.classList.add('collapse')
      collapseElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48" height="48"><path d="' + collapseMenuSvgPath + '"/></svg>'
      group.appendChild(collapseElement)

      const collapseMenu = {
        label: '',
        subMenu: []
      }

      // 루트 메뉴에 만들지 못한 메뉴들은 최소화 메뉴의 하위 메뉴로 구성한다.
      for (index; index < menuList.length; index++) {
        collapseMenu.subMenu.push(menuList[index])
      }

      // 메뉴를 클릭했을 때의 이벤트를 구성한다.
      this.addMenuClickListener(collapseElement, 0, collapseMenu)
      // 메뉴에 마우스를 가져다 댔을 때의 이벤트를 구성한다.
      this.addMenuOverListener(collapseElement, 0, collapseMenu)
    }
  }
  /**
   * 상위 메뉴객체를 기준으로 하위 메뉴를 생성합니다.
   * @param {상위 메뉴객체} root 
   * @param {메뉴레벨} level 
   * @param {하위 메뉴정보} menuList 
   */
  createMenu = (root, level, menuList) => {
    const group = this.createMenuGroup(level)
    if (root) {
      this.adjustGroupPosition(root, level, group)
    }
    // 레벨이 1이상(깊이가 1이상)이면 상위 메뉴의 selected 클래스를 초기화하고,
    // 선택한 메뉴에 selected 클래스를 부여한다.
    if (level > 0) {
      this.setMenuSelected(level - 1, root)
    }

    // 전달받은 메뉴 객체를 엘리멘트로 변환한다.
    menuList.forEach(menuInfo => {
      const element = this.createMenuItem(level, menuInfo)
      group.appendChild(element)
    })

    this.container.appendChild(group)
  }
  /**
   * 메뉴정보를 기반으로 메뉴 객체를 생성한다.
   * @param {메뉴의 레벨} level 
   * @param {메뉴정보} menuInfo 
   * @returns 
   */
  createMenuItem = (level, menuInfo) => {
    const element = document.createElement('li')
    if (menuInfo.seperator) {
      // 메뉴의 유형이 구분자(Seperator)인 경우
      element.setAttribute('type', 'seperator')
    }
    if (menuInfo.label) {
      // 정보에 label 값이 있을 경우 메뉴로 취급한다.
      element.setAttribute('type', 'menu')
      element.setAttribute('value', menuInfo.label)
      element.classList.add('evtb-menu-item-' + level)
      element.innerHTML = '<span class="evtb-menu-item-label">' + menuInfo.label + '</span>'

      // 레벨 1이상의 메뉴에서 하위 메뉴가 있을 경우
      // 하위 메뉴가 있다는 아이콘을 추가해준다.
      if (level >= 1 && menuInfo.subMenu != undefined) {
        element.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48" height="48"><path d="' + expandSubMenuSvgPath + '"/></svg>'
      } else if (level >= 1 && menuInfo.hotKey != undefined) {
        element.innerHTML += '<span class="evtb-menu-item-hotkey">' + menuInfo.hotKey + '</span>'
      }

      // 메뉴를 클릭했을 때의 이벤트를 구성한다.
      this.addMenuClickListener(element, level, menuInfo)
      // 메뉴에 마우스를 가져다 댔을 때의 이벤트를 구성한다.
      this.addMenuOverListener(element, level, menuInfo)
    }
    return element
  }
  /**
   * 메뉴의 레벨에 해당하는 ul 객체를 생성하여 반환한다.
   * @param {메뉴의 레벨} level 
   */
  createMenuGroup = (level) => {
    const group = document.createElement('ul')
    group.setAttribute('level', level)
    group.classList.add('evtb-menu-group')
    return group
  }
  /**
   * 부모객체의 위치에 맞게 하위 메뉴객체의 위치를 조정한다.
   * @param {부모객체} root
   * @param {하위 메뉴객체} group 
   */
  adjustGroupPosition = (root, level, group) => {
    let top = 0
    let left = 0

    if (level == 1) {
      top = root.getBoundingClientRect().height
      left = root.getBoundingClientRect().x
    } else if (level > 1) {
      // 메뉴그룹의 상단 패딩값 5px 만큼 빼준다.
      top = (root.getBoundingClientRect().y - 5)
      left = root.getBoundingClientRect().x + root.getBoundingClientRect().width
    }

    // 하위 메뉴의 우측변에 대한 X 값 위치
    const subGroupRightPositionX = left + root.getBoundingClientRect().width

    // 하위 메뉴의 우측변 X 값이 프레임을 벗어나는 경우
    if (subGroupRightPositionX > window.innerWidth) {
      // 우측변이 프레임에서 벗어난 픽셀만큼을 계산해서 빼준다.
      left -= (subGroupRightPositionX - window.innerWidth)
      // 너무 딱 붙어도 이상하니까 살짝 margin 값을 추가한다.
      left -= 10
      top += 10
    }

    group.style.top = Math.floor(top) + 'px'
    group.style.left = left + 'px'
  }
  /**
   * 해당 레벨에서 선택한 메뉴객체에 selected 클래스를 부여합니다.
   * 그 외 객체 중에서 selected 클래스를 가지고 있을 경우 해당 클래스를 삭제합니다.
   * @param {메뉴의 레벨} level 
   * @param {선택한 메뉴객체} root 
   */
  setMenuSelected = (level, root) => {
    const elements = this.container.querySelectorAll('li.evtb-menu-item-' + level)
    elements.forEach(li => {
      // 클릭한 메뉴 객체가 아닌데 selected 클래스가 있을 경우 제거한다.
      if (li != root && li.classList.contains('selected')) {
        li.classList.remove('selected')
      }
      // 클릭한 메뉴 객체인데 selected 클래스가 없을 경우 추가한다.
      if (li == root && !li.classList.contains('selected')) {
        li.classList.add('selected')
      }
    })
  }

  /**
   * 해당 레벨에서 selected 클래스를 갖고 있는 엘리멘트를 찾아서 반환한다.
   * @param {메뉴의 레벨} level 
   */
  getMenuSelected = (level) => {
    return this.container.querySelector('li.evtb-menu-item-' + level + '.selected')
  }

  /**
   * 메뉴를 클릭했을 때, 처리할 이벤트를 구성한다.
   * @param {메뉴 객체} element 
   * @param {메뉴의 정보} menuInfo 
   */
  addMenuClickListener = (element, level, menuInfo) => {
    element.addEventListener('click', (e) => {
      e.stopPropagation()
      if (menuInfo.subMenu != undefined) {
        const selectedElement = this.getMenuSelected(level)
        // 루트 메뉴인 경우 한번 더 클릭하면 메뉴를 비활성화한다.
        if (element == selectedElement && level == 0) {
          this.destoryMenuGroup(1)
          this.setMenuSelected(level, null)
          this.isMenuActivated = false
        } else {
          // 하위 메뉴가 있을 경우 하위 메뉴를 생성한다.
          this.destoryMenuGroup(level + 1)
          this.createMenu(element, level + 1, menuInfo.subMenu)
          this.isMenuActivated = true
        }
      } else {
        // 하위 메뉴가 없을 경우 클릭 이벤트를 발생시킨다.
        this.destoryMenuGroup(1)
        this.isMenuActivated = false
        this.emit('onMenuClick', menuInfo.label)
      }
    })
  }
  /**
   * 메뉴 위에 마우스를 가져다댔을 때, 처리할 이벤트를 구성한다.
   * @param {메뉴 객체} element 
   * @param {메뉴의 정보} menuInfo 
   */
  addMenuOverListener = (element, level, menuInfo) => {
    element.addEventListener('mouseover', (e) => {
      e.stopPropagation()
      if (!this.isMenuActivated) return
      this.destoryMenuGroup(level + 1)
      if (menuInfo.subMenu != undefined) {
        this.createMenu(element, level + 1, menuInfo.subMenu)
      }
    })
  }
  /**
   * 메뉴의 바깥을 클릭했을 때,
   * 메뉴를 비활성화하고 열려있는 메뉴를 모두 닫는 이벤트를 구성한다.
   */
  addMenuDestoryListener = () => {
    document.addEventListener('click', (e) => {
      let isMenuClicked = false

      const groups = this.container.querySelectorAll('ul.evtb-menu-group:not([level="0"])')
      groups.forEach(group => {
        if (e.target == group) {
          isMenuClicked = true
        }
      })
      
      if (!isMenuClicked) {
        this.destoryMenuGroup(1)
        this.isMenuActivated = false
      }
    })

    // 프레임이 변경되는 경우 활성화된 메뉴를 모두 닫는다.
    window.addEventListener('resize', (e) => {
      if (this.isMenuActivated) {
        this.destoryMenuGroup(1)
        this.isMenuActivated = false
      }
    })
  }
  /**
   * 전달받은 레벨보다 높은 레벨의 메뉴 그룹을 모두 삭제합니다.
   * @param {메뉴의 레벨} level 
   */
  destoryMenuGroup = (level) => {
    const groups = this.container.querySelectorAll('ul.evtb-menu-group')
    groups.forEach(group => {
      const groupLevel = Number(group.getAttribute('level'))
      if (groupLevel >= level) {
        if (groupLevel == 1) {
          // 메뉴의 레벨이 1이고, 삭제 대상인 경우
          // 루트메뉴의 selected 클래스를 모두 삭제하여 초기화한다.
          this.setMenuSelected(0, null)
        }
        group.remove()
      }
    })
  }
}

export default new ElectronViteTitleBarMenu()