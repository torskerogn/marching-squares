let mmap = [], partSizeX, partSizeY

let imgWhite, imgBlack
let currentImg

let textColorBlack = 'black'
let textColorWhite

let title = 'Name'
let type = 'Type'
let description = 'Description'
let percentage = '5.5'

let bigCan = 1416
let smallCan = 1000

let typeXPos = 1273
function preload() {
	imgWhite = loadImage('assets/åben-hvid.png')
	imgBlack = loadImage('assets/åben-sort.png')
}

let priColor = '#2622F7'
let bColor = '#E6E4D7'
let priPicker, bPicker

let cellSize = 25
let cellSlider

let noiseScale = 10
let noiseSlider

let strokeSize = 10
let strokeSlider

let mapWidth, mapHeight

let xOffSet = 0, yOffSet = 0

let canvas

function setup() {
	canvas = createCanvas(2420, 1416);
	currentImg = imgBlack
  	pixelDensity(1)


  //// SLIDERS + CNTRLS
    
    priPicker = createColorPicker(priColor)
    priPicker.parent("pattern")

    bPicker = createColorPicker(bColor)
    bPicker.parent("background")
	

    // -- //
    
    cellSlider = createSlider(20,50,25,1)
    cellSlider.input(() => {
      cellSize = cellSlider.value()
      generateMap()
    })
    cellSlider.parent("cell-size")
    
    cellSize = cellSlider.value()
      
      // ----- //
    
    noiseSlider = createSlider(2,15,10,1)
      noiseSlider.input(() => {
        noiseScale = noiseSlider.value()
        generateMap()
      })
      noiseSlider.parent("noise")

      noiseScale = noiseSlider.value()

      // ----- //
    
    strokeSlider = createSlider(0.3,20,0.3,0.1)
      strokeSlider.input(() => {
        strokeSize = strokeSlider.value()
        generateMap()
      })

      strokeSlider.parent("stroke")

      strokeSize = strokeSlider.value()

      // ---- //



      //// END
      
      

      strokeWeight(strokeSize)
      strokeJoin(ROUND)
      generateMap()

	  const name = document.getElementById('text-box')
	  name.value = title
	  name.addEventListener('input', () => {
		title = name.value
		redraw()
	  })

	  const des = document.getElementById('description')
	  des.value = description
	  des.addEventListener('input', () => {
		description = des.value
		redraw()
	  })

	  const category = document.getElementById('type')
	  category.value = type
	  category.addEventListener('input', () => {
		type = category.value
		redraw()
	  })

	  const alc = document.getElementById('percentage')
	  alc.value = percentage
	  alc.addEventListener('input', () => {
		percentage = alc.value
		redraw()
	  })

	  const whiteBtn = document.getElementById('white-button')
	  const blackBtn = document.getElementById('black-button')

	  whiteBtn.addEventListener('click', () => {
		textColorBlack = 'white'
		currentImg = imgWhite
		redraw()
	  })

	  blackBtn.addEventListener('click', () => {
		textColorBlack = 'black'
		currentImg = imgBlack
		redraw()
	  })

	  const randomBtn = document.getElementById('RNDM-btn')
	  randomBtn.addEventListener('click', randomize)

	  const pngBtn = document.getElementById('PNG-btn')
	  pngBtn.addEventListener('click', savePNG)
}

function generateMap() {
  console.log(xOffSet)
  mmap = []
  mapWidth = floor(width / cellSize) + 2
  mapHeight = floor(height / cellSize) + 2
  partSizeX = cellSize
  partSizeY = cellSize
	
	for (let x = 0; x < mapWidth; x++) {
		let temp = []
		for (let y = 0; y < mapHeight; y++) {
			temp.push(round(noise((x+xOffSet) / noiseScale, (y+yOffSet) / noiseScale)))
		}
		mmap.push(temp)
	}
}	
	
function draw() {
  background(bPicker.value())
  stroke(priPicker.value())
  strokeWeight(strokeSize)
  fill(priPicker.value())

  let pos = createVector(round(map(mouseX, 0, width, 0, mapWidth)), round(map(mouseY, 0, height, 0, mapHeight)))
	if(keyIsDown(65)) {
		for(let x = -1; x <= 1; x++) {
			for(let y = -1; y <= 1; y++) {
				mmap[min(max(pos.x + x, 0), mapWidth-1)][min(max(pos.y + y, 0), mapHeight-1)] = 1
			}
		}
	}
	if(keyIsDown(83)) {
		for(let x = -1; x <= 1; x++) {
			for(let y = -1; y <= 1; y++) {
				mmap[min(max(pos.x + x, 0), mapWidth-1)][min(max(pos.y + y, 0), mapHeight-1)] = 0
			}
		}
	}
for (let x = 0; x < mmap.length - 1; x++) {
		for (let y = 0; y < mmap[x].length - 1; y++) {
			let hsX = partSizeX / 2
			let hsY = partSizeY / 2
			let origin = createVector(x * partSizeX, y * partSizeY)
			let corners = [
				origin,
				createVector(origin.x + partSizeX, origin.y),
				createVector(origin.x, origin.y + partSizeY),
				createVector(origin.x + partSizeX, origin.y + partSizeY)
			]
			let top = createVector(origin.x + hsX, origin.y)
			let left = createVector(origin.x, origin.y + hsY)
			let bottom = createVector(origin.x + hsX, origin.y + partSizeY)
			let right = createVector(origin.x + partSizeX, origin.y + hsY)

			partValues = mmap[x][y] * 1 + mmap[x + 1][y] * 2 + mmap[x][y + 1] * 4 + mmap[x + 1][y + 1] * 8
			switch (partValues) {
				case 0:
					break;
				case 1:
					drawFour(top, left, corners[0])
					break;
				case 2:
					drawFour(top, right, corners[1])
					break;
				case 3:
					drawFour(left, right, corners[1], corners[0])
					break;
				case 4:
					drawFour(left, bottom, corners[2])
					break;
				case 5:
					drawFour(top, bottom, corners[2], corners[0])
					break;
				case 6:
					drawFour(top, left, corners[2], corners[1])
					drawFour(bottom, right, corners[1], corners[2])
					break;
				case 7:
					drawFour(corners[0], corners[1], right, left)
					drawFour(corners[2], left, right, bottom)
					break;
				case 8:
					drawFour(bottom, right, corners[3])
					break;
				case 9:
					drawFour(bottom, right, corners[3])
					drawFour(left, top, corners[0])
					break;
				case 10:
					drawFour(bottom, top, corners[1], corners[3])
					break;
				case 11:
					drawFour(left, bottom, corners[3], right)
					drawFour(left, corners[0], corners[1], right)
					break;
				case 12:
					drawFour(left, right, corners[3], corners[2])
					break;
				case 13:
					drawFour(right, top, corners[0], left)
					drawFour(right, corners[3], corners[2], left)
					break;
				case 14:
					drawFour(top, left, right, corners[1])
					drawFour(left, corners[2], corners[3], right)
					break;
				case 15:
					drawFour(corners[0], corners[1], corners[3], corners[2])
					break;
			}
		}
	}
	//RECTANGLE BAG TEKST
	push()
	fill(bPicker.value())
	noStroke()
	rect(1250,210,670,635)
	pop()

	// BILLEDE SKABELON
	image(currentImg,0,0,width,height)
	
	// TITLE PÅ ØL
	push()
	fill(textColorBlack)
	noStroke()
	textSize(80)
	text(title, 1270, 300)
	pop()

	// TYPE
	push()
	fill(textColorBlack)
	noStroke()
	textSize(40)
	text(type + "   –   "+percentage + "%" ,typeXPos,362)
	pop()

	// ALKOHOL PROCENT
	// push()
	// fill(textColorBlack)
	// noStroke()
	// textSize(40)
	// text(percentage,(typeXPos+400),362)

	// DESKRIPTIONNN
	push()
	fill(textColorBlack)
	noStroke()
	textSize(24)
	text(description, 1275, 390, 630, 110)
	pop()

}

function drawFour(vect1, vect2, vect3 = vect2, vect4 = vect1) {
	beginShape()
	vertex(vect1.x, vect1.y)
	vertex(vect2.x, vect2.y)
	vertex(vect3.x, vect3.y)
	vertex(vect4.x, vect4.y)
	endShape(CLOSE)
}

function mouseDragged() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    xOffSet += (pmouseX - mouseX) / 100
    yOffSet += (pmouseY - mouseY) / 100
    generateMap()
  }
}

function randomize() {
	cellSlider.value(floor(random(20,50)))
	noiseSlider.value(floor(random(2,15)))
	strokeSlider.value(floor(random(0.3,20)))

	cellSize = cellSlider.value()
	noiseScale = noiseSlider.value()
	strokeSize = strokeSlider.value()

	strokeWeight(strokeSize)
	generateMap()
}

function savePNG() {
	redraw()
	saveCanvas(canvas,'åben1','png')
}
