# Typeorm Test

1. Run `npm i` command
2. Run `docker-compose up` command
3. Run `npm test` command

---

PASS test/user.test.ts  
영속성 테스트

하나의 엔티티 대상 테스트

- ✓ 새로운 엔티티 생성 후, save시 기존 엔티티가 업데이트 되는가 (33 ms)
- ✓ 새로운 엔티티 생성 후, insert시 기존 엔티티가 업데이트 되는가 (20 ms)
- ✓ 다른 트랜잭션에서 새로운 엔티티 생성 후, 같은 엔티티를 select로 얻어온 경우, 엔티티는 서로 다른가 (33 ms)
- ✓ 같은 트랜잭션에서 새로운 엔티티 생성 후, 같은 엔티티를 select로 얻어온 경우, 엔티티는 서로 다른가 (27 ms)  
  -> 같은 트랜잭션내에서 save시 insert, select가 호출되는데 다시 select하는 경우에도 다시 쿼리가 나감.

연관관계 관련 테스트

- ✓ 연관된 객체 조회후 재조회시, 두 객체는 서로 같은가 (42 ms)

---
