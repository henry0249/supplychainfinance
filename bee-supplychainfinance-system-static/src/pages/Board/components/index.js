import ApplysComp from './Applys'
import RiskRatioComp from './RiskRatio'
import BillComp from './Bill'
import FinanceComp from './Finance'
import TodoComp from './Todo'
import EnterPriseComp from './EnterPrise'
import WelcomeComp from './Welcome'
import TotalProfitComp from './TotalProfit'
import RiskComp from './Risk'
import AmountComp from './Amount'
import MonitorComp from './Monitor'
import CompanyHeaderComp from './CompanyHeader'

const Applys = (props) => <ApplysComp {...props} />
const RiskRatio = (props) => <RiskRatioComp {...props} />
const Bill = (props) => <BillComp {...props} />
const Finance = (props) => <FinanceComp {...props} />
const Todo = (props) => <TodoComp {...props} />
const EnterPrise = (props) => <EnterPriseComp {...props} />
const Welcome = (props) => <WelcomeComp {...props} />
const TotalProfit = (props) => <TotalProfitComp {...props} />
const Risk = (props) => <RiskComp {...props} />
const Amount = (props) => <AmountComp {...props} />
const Monitor = (props) => <MonitorComp {...props} />
const CompanyHeader = (props) => <CompanyHeaderComp {...props} />

export { Applys, RiskRatio, Bill, Finance, Todo, EnterPrise, Welcome, TotalProfit, Risk, Amount, Monitor, CompanyHeader }