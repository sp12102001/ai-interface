$(document).ready(function() {
    let API_KEY = '';
    
    function addMessage(message, isUser = false) {
        const messageElement = $('<div>').addClass('message').addClass(isUser ? 'user-message' : 'bot-message').text(message);
        $('#chat-history').append(messageElement);
        $('#chat-history').scrollTop($('#chat-history')[0].scrollHeight);
    }

    addMessage("Hi, I'm an AI chatbot. How can I help you today?");

    $('#submit-btn').click(function() {
        const prompt = $('#prompt').val().trim();
        if (prompt === '') return;

        API_KEY = $('#api-key-input').val().trim();
        if (API_KEY === '') {
            addMessage("Please enter your OpenAI API key.", false);
            return;
        }

        addMessage(prompt, true);
        $('#prompt').val('');
        $('#submit-btn').prop('disabled', true).html('<span class="spinner"></span>');

        $.ajax({
            type: 'POST',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Authorization': 'Bearer ' + API_KEY,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{role: "user", content: prompt}],
                max_tokens: 150,
                temperature: 0.7
            }),
            success: function(data) {
                if (data && data.choices && data.choices.length > 0) {
                    const response = data.choices[0].message.content.trim();
                    addMessage(response);
                } else {
                    addMessage("Sorry, I couldn't process the response.");
                }
            },
            error: function(xhr, status, error) {
                addMessage("Error: " + xhr.responseText);
            },
            complete: function() {
                $('#submit-btn').prop('disabled', false).text('Send');
            }
        });
    });

    $('#prompt').keypress(function(e) {
        if (e.which == 13) {
            $('#submit-btn').click();
            return false;
        }
    });
});
