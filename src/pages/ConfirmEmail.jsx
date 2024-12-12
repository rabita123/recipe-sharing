import { useLocation, Link } from 'react-router-dom'

function ConfirmEmail() {
  const location = useLocation()
  const email = location.state?.email

  return (
    <div className="min-h-[80vh] flex items-center justify-center container-padding">
      <div className="max-w-md w-full space-y-8 card p-8 text-center">
        <div>
          <h1 className="page-title">Check Your Email</h1>
          <div className="mt-4 text-content">
            <p>
              We've sent a confirmation email to:
              <br />
              <strong className="text-gray-900">{email}</strong>
            </p>
            <p className="mt-4">
              Click the link in the email to confirm your account.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Didn't receive the email?
          </p>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => window.location.reload()}
            >
              Resend confirmation email
            </button>
            <Link
              to="/login"
              className="btn-primary w-full inline-block"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmEmail 