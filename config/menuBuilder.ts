import { MenuBuilder, type MenuItemConfig } from '@menu'
import { MapPinned } from 'lucide-vue-next'

export class AddressMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'admin') {
      return this.buildMainMenu(menu)
    }

    return menu
  }

  private buildMainMenu(menu: MenuItemConfig): MenuItemConfig {
    const addressSection: MenuItemConfig = {
      id: 'address-management',
      title: 'Címek',
      icon: MapPinned,
      order: 36,
      children: [
        {
          id: 'country-list',
          title: 'Országok',
          path: '/admin/countries',
          order: 1,
        },
      ],
    }

    this.addMenuItem(menu, addressSection)

    return menu
  }
}

export const addressMenuBuilder = new AddressMenuBuilder()

