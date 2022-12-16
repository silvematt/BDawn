function OnLogin() 
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            var res = JSON.parse(this.responseText);
            
            // Add to local storage
            localStorage.setItem("bdawn_sess_tkn", res.rTkn);
            
            //alert(localStorage.getItem("bdawn_sess_tkn"));
            
            const resLabel = document.getElementById('ResultLabel');

            if(res.rMessage == "LOGIN_OK")
            {
            resLabel.textContent = "Logged in!";
            location.href = "http://localhost:3000/cOverview";
            }
            else if(res.rMessage == "LOGIN_NOT_OK")
            {
            resLabel.textContent = "Invalid username or password.";
            }
            else
            {
            resLabel.textContent = "Error.";
            }

        }
    };

    var formUser = document.getElementById("FORM_USERNAME").value;
    var formPassword = document.getElementById("FORM_PASSWORD").value;

    request.open('POST', 'http://localhost:3000/login');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`user=${formUser}&password=${formPassword}`);
}