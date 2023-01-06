function OnRegister() 
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

            if(res.rMessage == "REGISTER_OK")
            {
            resLabel.textContent = "Registration completed!";
            }
            else if(res.rMessage == "REGISTER_NOT_OK")
            {
            resLabel.textContent = "Username or email already in use.";
            }
            else
            {
            resLabel.textContent = "Error.";
            }

        }
    };

    var formUser = document.getElementById("FORM_USERNAME").value;
    var formPassword = document.getElementById("FORM_PASSWORD").value;
    var formEmail = document.getElementById("FORM_EMAIL").value;

    request.open('POST', 'http://localhost:3000/register');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(`user=${formUser}&password=${formPassword}&email=${formEmail}`);
}