<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          FAQ
        </h2>
      </div>
    </div>
    <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
    <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
      <AccordionTrigger>{{ item.title }}</AccordionTrigger>
      <AccordionContent v-html="item.content" />
    </AccordionItem>
  </Accordion>
  </div>
</template>

<script setup lang="ts">
const defaultValue = 'item-1'

const accordionItems = [
  { value: 'item-1', title: 'What is this project about?', content: 'This web application is centered around an <strong>admin dashboard</strong> that allows administrators to <strong>manage bookings, view a list of bookings, add new bookings, and manage users efficiently</strong>. The dashboard serves as a powerful tool for administrators to track and control all aspects of the booking process, including overseeing user profiles, adjusting booking details, and maintaining an organized system. The admin interface is designed to be intuitive, making it easy to navigate through bookings and users.<br> While payment integration is not yet implemented, it is planned for future development to enable secure transactions for booking confirmations.' },
  {
  value: 'item-2',
  title: 'What skills and technologies were used in this project?',
  content: `
    • Frontend: HTML, CSS, JavaScript, Nuxt , Tailwind CSS<br>
    • Backend: Node.js, Express<br>
    • Database: MySQL<br>
    • Authentication: JWT<br>
    • APIs: REST<br>
    • Other tools: Git, GitHub, Postman
  `
}
,
{ value: 'item-3', title: 'Is this project responsive/mobile-friendly?', content: 'Yes, the UI is fully responsive and works on all modern devices and screen sizes.' },
{ value: 'item-4', title: 'How do I run this project locally?', content: 'Clone the repo, run npm install, then npm run dev.' },
{ value: 'item-5', title: 'What was the biggest challenge during development?', content: 'Handling authentication state across sessions and ensuring smooth user experience across devices.' },
]
</script>
