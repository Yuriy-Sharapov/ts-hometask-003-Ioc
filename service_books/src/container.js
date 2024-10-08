// IoC контейнер
import { Container } from 'inversify'
import { clBooksRepository } from './classes/cBooksRepository'

const ioc = new Container()
ioc.bind(clBooksRepository).toSelf()