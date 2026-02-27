/**
 * Test setup file — runs before every test suite.
 *
 * This file does one important thing: it imports @testing-library/jest-dom
 * which adds custom DOM matchers to Vitest's `expect()`. For example:
 *
 *   expect(element).toBeInTheDocument()   — checks if element is in the DOM
 *   expect(element).toHaveTextContent()   — checks text inside an element
 *   expect(element).toBeVisible()         — checks if element is visible
 *   expect(element).toHaveAttribute()     — checks element attributes
 *
 * Without this import, these matchers would not exist and tests would fail
 * with "toBeInTheDocument is not a function".
 */
import '@testing-library/jest-dom';
