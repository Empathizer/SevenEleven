// Input validation and sanitization utilities

export function sanitizeString(input: string): string {
  if (!input) return ''
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

export function sanitizeEmail(email: string): string {
  if (!email) return ''
  return email.toLowerCase().trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password) return { valid: false, message: 'Password is required' }
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' }
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain uppercase letter' }
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain lowercase letter' }
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain number' }
  return { valid: true }
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/
  return phoneRegex.test(phone)
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255)
}

export function validateFileType(filename: string, allowedTypes: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? allowedTypes.includes(ext) : false
}

export function validateFileSize(size: number, maxSizeMB: number = 5): boolean {
  return size <= maxSizeMB * 1024 * 1024
}

export function sanitizeMongoQuery(query: any): any {
  if (typeof query !== 'object' || query === null) return query
  
  const sanitized: any = {}
  for (const [key, value] of Object.entries(query)) {
    // Remove $ operators from user input
    if (key.startsWith('$')) continue
    
    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMongoQuery(value)
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

export function validateObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

export function sanitizeNumber(input: any, min?: number, max?: number): number | null {
  const num = Number(input)
  if (isNaN(num)) return null
  if (min !== undefined && num < min) return null
  if (max !== undefined && num > max) return null
  return num
}

export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}
