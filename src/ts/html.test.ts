import { ParsedHTML } from "./html"

test("ParsedHTML",() => {
    let parsedHTML;

    parsedHTML = new ParsedHTML(`
<!doctype html> <html lang="en"> <head>
    <title>this is title</title>
    <meta name="description" content="this is description">
  </head> <body> </body> </html>
    `)
    
    expect(parsedHTML.getTitle()).toBe("this is title")
    expect(parsedHTML.getDesc()).toBe("this is description")

    

    // test2 
    parsedHTML = new ParsedHTML(`
<!doctype html> <html lang="en"> <head>
    <meta name="description" content="this is description">
  </head> <body> </body> </html>
    `)
    
    expect(parsedHTML.getTitle()).toBe("")
    expect(parsedHTML.getDesc()).toBe("this is description")

    // test3 
    parsedHTML = new ParsedHTML(`
<!doctype html> <html lang="en"> <head>
  </head> <body> </body> </html>
    `)
    
    expect(parsedHTML.getTitle()).toBe("")
    expect(parsedHTML.getDesc()).toBe("")
})