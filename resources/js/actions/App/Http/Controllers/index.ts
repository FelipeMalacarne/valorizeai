import BankController from './BankController'
import AccountController from './AccountController'
import TransactionController from './TransactionController'
import CategoryController from './CategoryController'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    BankController: Object.assign(BankController, BankController),
    AccountController: Object.assign(AccountController, AccountController),
    TransactionController: Object.assign(TransactionController, TransactionController),
    CategoryController: Object.assign(CategoryController, CategoryController),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers