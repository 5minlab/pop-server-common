import { companyIpFilter } from '../../src/pop-server-common'

it('companyIpFilter', () => {
  const x = companyIpFilter({ ips: [] })
  expect(typeof x).toBe('function')
})
