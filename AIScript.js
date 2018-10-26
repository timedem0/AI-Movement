/*
simple AI movement script
that can follow player, search for player and return to idle state
*/

#pragma strict

var player:Transform;
var playerPos:Vector3;
var playerLastPos:Vector3;
var lookPos:Vector3;
var pinguCollider:SphereCollider;

var idle:boolean;
var playerSighted:boolean;
var playerLost:boolean;
var playerLookup:boolean;

var guiStatus:GUIText;
var rangeStatus:GUIText;
var status:String;

var moveSpeed:int = 10;
var minDist:int = 4;
var directionChangeInterval:float = 2;
var wakePinguInterval:float = 5;
var searchInterval:float = 10;

var foundSound:AudioClip; 
var reachedSound:AudioClip;

function Awake () {
	
	idle = false;
	playerSighted = false;
	playerLost = false;
	playerLookup = false;
	pinguCollider = GetComponent(SphereCollider) as SphereCollider;
	guiStatus = GameObject.FindWithTag("Status").guiText;
	rangeStatus = GameObject.FindWithTag("Range").guiText;
	rangeStatus.text = "Current range: " + pinguCollider.radius;
	status = "Current status: Pingu is awake!";
}

function Update () {

	playerPos = Vector3(player.position.x, 0, player.position.z);
	
	if (idle == true) {
		playerSighted = false;
		playerLost = false;
		playerLookup = false;
	}
	
	if (idle == false && playerSighted == true)
		PlayerFound();
	if (idle == false && playerLost == true && playerLookup == false)
		PlayerSearch();
	if (idle == false && playerLost == true && playerLookup == true)
		LookAround();

	guiStatus.text = status; 
	
	if(Input.GetKeyDown(KeyCode.E)) {
        pinguCollider.radius = pinguCollider.radius + 1;
		rangeStatus.text = "Current range: " + pinguCollider.radius;
    }
   	if(Input.GetKeyDown(KeyCode.Q)) {
        pinguCollider.radius = pinguCollider.radius - 1;
		rangeStatus.text = "Current range: " + pinguCollider.radius;
    }
}

function OnTriggerEnter (other:Collider) {

	if (other.transform == player) {
		playerLost = false;
		playerLookup = false;
		if (idle == false)
			AudioSource.PlayClipAtPoint(foundSound,transform.position);
	}
}

function OnTriggerStay (other:Collider) {

	if (other.transform == player) {
		playerSighted = true;
	}
}

function OnTriggerExit (other:Collider) {

	if (other.transform == player) {
		playerSighted = false;
		playerLost = true;
		playerLookup = false;
		playerLastPos = playerPos;
	}
}

function PlayerFound () {

	status = "Current status: Pingu discovered you!";
	transform.LookAt(playerPos);
	transform.position = Vector3.MoveTowards(transform.position, playerPos, moveSpeed * Time.deltaTime);
	if (Vector3.Distance(transform.position, player.position) <= minDist) {
		status = "Current status: Pingu reached you and is resting for " + wakePinguInterval + " seconds!";
		AudioSource.PlayClipAtPoint(reachedSound,transform.position);
		PinguIdle();
	}
}

function PlayerSearch () {

	status = "Current status: Pingu lost you!";
	transform.position = Vector3.MoveTowards(transform.position, playerLastPos, (moveSpeed/2 - 1) * Time.deltaTime);
	if (Vector3.Distance (transform.position, playerLastPos) <= 0)
		playerLookup = true;
}

function LookAround () {

	status = "Current status: Pingu is looking for you for " + searchInterval + " seconds!";
	transform.LookAt(lookPos);
	transform.position = Vector3.MoveTowards(transform.position, lookPos, (moveSpeed/2 - 1) * Time.deltaTime);
	
	while (playerLookup) {
		yield WaitForSeconds(searchInterval);
		status = "Current status: Pingu gave up and is resting for " + wakePinguInterval + " seconds!";
		PinguIdle();
	}
}

function PinguIdle () {

		transform.position = Vector3.MoveTowards(transform.position, playerLastPos, 0);
		idle = true;
		
		while (idle) {
			yield WaitForSeconds(wakePinguInterval);
			idle = false;
			status = "Current status: Pingu is awake!";
			StopAllCoroutines();
		}
}

while (true) {

	NewHeading();
	yield WaitForSeconds(directionChangeInterval);
}

function NewHeading () {

	lookPos = playerPos + Vector3(Random.Range(-40,40), 0, Random.Range(-40,40));
}