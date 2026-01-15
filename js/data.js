const animals = [];
for(let i=1;i<=100;i++){
  animals.push({
    id: "animal"+i,
    name: "Animal "+i,
    region: "Region "+((i%10)+1),
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Placeholder_cat.jpg/240px-Placeholder_cat.jpg",
    description: "This is a placeholder description for Animal "+i+". You can scroll to read more text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac lorem nec nulla varius feugiat."
  });
}
