#pragma strict

var speed:float = 20;
var rotateSpeed:float = 200;
var jumpAmplitude:float = 8;
var jump:AudioClip; 
var land:AudioClip;

function Update () {

	transform.Translate(Vector3(0, 0, Input.GetAxis("Vertical")) * Time.deltaTime * speed);
	transform.Rotate(Vector3(0, Input.GetAxis("Horizontal"), 0) * Time.deltaTime * rotateSpeed);

	if (Input.GetKeyDown("space")) {
		rigidbody.velocity = Vector3.up * jumpAmplitude;
 		AudioSource.PlayClipAtPoint(jump,transform.position);
 	} 
}

function OnCollisionEnter (other:Collision) {

    if (other.gameObject.tag == "Ground") {
    	AudioSource.PlayClipAtPoint(land,transform.position);
    }
}