# Just Another Dice Bot
  
Another rewrite of my Dice rolling Discord Bot.  
  
No longer uses hardcoded channel names, instead:  
`;setrollchannel` - Can be used to designate a rolls channel  
`;delrollchannel` - Can be used to remove a roll channel designation  
  
In a designated rolls channel, using the standard roll notation you can specify a roll to make:  
`<quantity>d<dice size><modifier>`  
ex: 
`4d20`  
`2d8+4`  
`d4-6`  
  
Considering it's just a RNG, this allows for non-standard dice sizes:  
`d5`  
`d17`  
`d200`  
etc.  
  
Designated roll channels are saved in a sqlite database.  
One doesn't need to be made, if it doesn't already exist, one will automatically be made.  

Set token in ENV Variables:
`TOKEN="<your token>"`

## Contributing
Feel free to make a PR if you have something you want to change, update, modify, etc.  
MIT License  
