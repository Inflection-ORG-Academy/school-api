const forgotPasswordTemplate = (token) => {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
  </head>
  
  <body>
    <div class="card text-center" style="width: 300px;">
      <div class="card-header h5 text-white bg-primary">Password Reset</div>
      <div class="card-body px-5">
        <p class="card-text py-2">
          This token will be valid for 5 min
        </p>
        <a href="http://localhost:5000/reset_password/${token}" class="btn btn-primary w-100">Reset password</a>
      </div>
    </div>
  </body>
  
  </html>`
}

export { forgotPasswordTemplate }