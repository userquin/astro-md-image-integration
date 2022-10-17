import type { AstroIntegration } from 'astro'
import { createAstroIntegration } from './hooks'

export default function (): AstroIntegration {
  return createAstroIntegration()
}
