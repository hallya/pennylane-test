import { describe, it, expect } from 'vitest'
import { CustomerEntity } from '../Customer'
import { CustomerTestDataFactory } from '../../__tests__/utils'

describe('CustomerEntity', () => {
  describe('getFullName', () => {
    it('should return full name with first and last name', () => {
      const customer = new CustomerEntity(CustomerTestDataFactory.create({
        first_name: 'John',
        last_name: 'Doe'
      }))
      expect(customer.getFullName()).toBe('John Doe')
    })

    it('should handle names with spaces correctly', () => {
      const customer = new CustomerEntity(CustomerTestDataFactory.create({
        first_name: 'Jean-Pierre',
        last_name: 'De La Fontaine'
      }))
      expect(customer.getFullName()).toBe('Jean-Pierre De La Fontaine')
    })

    it('should handle single letter names', () => {
      const customer = new CustomerEntity(CustomerTestDataFactory.create({
        first_name: 'A',
        last_name: 'B'
      }))
      expect(customer.getFullName()).toBe('A B')
    })

    it('should handle empty first name', () => {
      const customer = new CustomerEntity(CustomerTestDataFactory.create({
        first_name: '',
        last_name: 'Doe'
      }))
      expect(customer.getFullName()).toBe('Doe')
    })

    it('should handle empty last name', () => {
      const customer = new CustomerEntity(CustomerTestDataFactory.create({
        first_name: 'John',
        last_name: ''
      }))
      expect(customer.getFullName()).toBe('John')
    })

    it('should handle both names empty', () => {
      const customer = new CustomerEntity(CustomerTestDataFactory.create({
        first_name: '',
        last_name: ''
      }))
      expect(customer.getFullName()).toBe('')
    })

    it('should handle accented characters', () => {
      const customer = new CustomerEntity(CustomerTestDataFactory.create({
        first_name: 'José',
        last_name: 'García'
      }))
      expect(customer.getFullName()).toBe('José García')
    })

    it('should handle long names', () => {
      const customer = new CustomerEntity(CustomerTestDataFactory.create({
        first_name: 'Christopher',
        last_name: 'Washington'
      }))
      expect(customer.getFullName()).toBe('Christopher Washington')
    })
  })
})