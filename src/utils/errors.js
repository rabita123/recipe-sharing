export class AuthError extends Error {
  constructor(message = 'You must be logged in to perform this action') {
    super(message)
    this.name = 'AuthError'
  }
}

export class ValidationError extends Error {
  constructor(message = 'Invalid input data') {
    super(message)
    this.name = 'ValidationError'
  }
}

export class StorageError extends Error {
  constructor(message = 'Failed to handle file storage') {
    super(message)
    this.name = 'StorageError'
  }
}

export class DatabaseError extends Error {
  constructor(message = 'Database operation failed') {
    super(message)
    this.name = 'DatabaseError'
  }
} 